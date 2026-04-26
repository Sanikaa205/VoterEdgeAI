import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User } from 'lucide-react'
import './AIChat.css'

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const liveRegionRef = useRef(null)
  const inputRef = useRef(null)
  const sendDebounceRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  // Auto-scroll to newest message
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 150)
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      if (sendDebounceRef.current) {
        clearTimeout(sendDebounceRef.current)
      }
    }
  }, [])

  // Announce new messages to screen readers
  const announceMessage = (text) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = text
    }
  }

  // Format response text with basic markdown-like rendering
  const formatResponseText = (text) => {
    if (!text) return ''

    // Split into lines and process
    const lines = text.split('\n')
    const elements = []
    let key = 0

    for (const line of lines) {
      const trimmed = line.trim()

      if (!trimmed) {
        elements.push(<br key={key++} />)
        continue
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={key++} className="chat-bullet">
            <span className="bullet-dot">•</span>
            <span>{formatInline(trimmed.slice(2))}</span>
          </div>
        )
        continue
      }

      // Numbered lists
      const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/)
      if (numberedMatch) {
        elements.push(
          <div key={key++} className="chat-numbered">
            <span className="number-badge">{numberedMatch[1]}</span>
            <span>{formatInline(numberedMatch[2])}</span>
          </div>
        )
        continue
      }

      // Regular text
      elements.push(<p key={key++} className="chat-paragraph">{formatInline(trimmed)}</p>)
    }

    return elements
  }

  // Inline formatting (bold)
  const formatInline = (text) => {
    const parts = text.split(/\*\*(.+?)\*\*/g)
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    )
  }

  const sendMessageNow = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmedInput,
      timestamp: new Date()
    }

    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setError('')
    setIsLoading(true)

    announceMessage(`You: ${trimmedInput}`)

    try {
      const chatHistory = nextMessages.slice(-5).map(msg => ({
        sender: msg.sender,
        text: msg.text
      }))

      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: trimmedInput,
          history: chatHistory
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error (${response.status})`)
      }

      const data = await response.json()
      const replyText = typeof data.reply === 'string'
        ? data.reply.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim()
        : ''
      if (!replyText) throw new Error('Empty response from assistant')

      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      announceMessage(`VoterEdge AI: ${replyText}`)

    } catch (err) {
      console.error('Chat error:', err)
      const fallbackMessage = "I'm sorry, I couldn't process your request right now. Please try again in a moment."
      setError(err.message || 'Unable to reach assistant.')
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: fallbackMessage,
          timestamp: new Date()
        }
      ])
      announceMessage(`VoterEdge AI: ${fallbackMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const sendMessage = () => {
    if (sendDebounceRef.current) {
      clearTimeout(sendDebounceRef.current)
    }

    sendDebounceRef.current = setTimeout(() => {
      if (!isLoading) {
        sendMessageNow()
      }
    }, 300)
  }

  return (
    <>
      {/* Live region for accessibility */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          className="chat-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat assistant"
          title="Chat with VoterEdge AI"
        >
          <MessageCircle size={24} />
          <span className="chat-button-pulse" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-panel" role="dialog" aria-label="VoterEdge AI Chat">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-title">
              <div className="chat-avatar">
                <Bot size={18} />
              </div>
              <div>
                <span className="chat-name">VoterEdge AI</span>
                <span className="chat-status">Online</span>
              </div>
            </div>
            <button
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty">
                <div className="chat-empty-icon">
                  <Bot size={32} />
                </div>
                <h3>Hi! I'm VoterEdge AI</h3>
                <p>Your neutral election assistant. Ask me about:</p>
                <div className="chat-suggestions">
                  <button onClick={() => { setInput('How do I register to vote?'); }} className="suggestion-chip">
                    How to register?
                  </button>
                  <button onClick={() => { setInput('What documents do I need to vote?'); }} className="suggestion-chip">
                    Documents needed
                  </button>
                  <button onClick={() => { setInput('How does EVM work?'); }} className="suggestion-chip">
                    How EVM works
                  </button>
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`message message-${msg.sender}`}
                role="article"
                aria-label={`${msg.sender === 'user' ? 'You' : 'VoterEdge AI'}: ${msg.text}`}
              >
                <div className="message-avatar">
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="message-bubble">
                  {msg.sender === 'assistant' ? (
                    <div className="formatted-response">
                      {formatResponseText(msg.text)}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message message-assistant">
                <div className="message-avatar">
                  <Bot size={14} />
                </div>
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="chat-error" role="alert">
              <span>{error}</span>
              <button onClick={() => setError('')} aria-label="Dismiss error">✕</button>
            </div>
          )}

          {/* Input Area */}
          <div className="chat-input-area">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about elections, voting, documents..."
              className="chat-input"
              disabled={isLoading}
              rows="2"
              aria-label="Type your message"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="send-button"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChat
