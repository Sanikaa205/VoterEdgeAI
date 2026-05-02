import React, { useState, useCallback, useRef } from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api'
import { MapPin, Search, Loader, Clock, Accessibility } from 'lucide-react'
import './BoothLocator.css'

const BoothLocator = () => {
  const [booths, setBooths] = useState([])
  const [userLocation, setUserLocation] = useState({
    lat: 19.0760,
    lng: 72.8777
  })
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [address, setAddress] = useState('')
  const [mapError, setMapError] = useState(false)
  const [runtimeMapsKey, setRuntimeMapsKey] = useState('')
  const mapRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || ''
  const GOOGLE_MAPS_KEY = runtimeMapsKey || import.meta.env.VITE_GOOGLE_MAPS_KEY || ''
  const hasValidMapsKey = GOOGLE_MAPS_KEY && !GOOGLE_MAPS_KEY.startsWith('your_')

  useEffect(() => {
    const loadRuntimeConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public-config`)
        if (!response.ok) return

        const config = await response.json()
        if (config?.googleMapsKey) {
          setRuntimeMapsKey(config.googleMapsKey)
        }
      } catch {
        // Keep using build-time env if runtime config is unavailable
      }
    }

    loadRuntimeConfig()
  }, [API_URL])

  const mapContainerStyle = {
    width: '100%',
    height: '450px',
    borderRadius: '12px'
  }

  // Fetch booths nearby
  const fetchBoothsNearby = useCallback(async (lat, lng) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/booth/nearby?lat=${lat}&lng=${lng}`
      )

      if (!response.ok) {
        // If nearby fails (no booths in range), try all booths
        const allResponse = await fetch(`${API_URL}/api/booth`)
        if (!allResponse.ok) throw new Error('Failed to fetch booths')
        const allData = await allResponse.json()
        if (allData.success) {
          setBooths(allData.data || [])
          setUserLocation({ lat, lng })
          setSelectedMarker(null)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        setBooths(data.data)
        setUserLocation({ lat, lng })
        setSelectedMarker(null)
      } else {
        // Fallback: load all booths
        const allResponse = await fetch(`${API_URL}/api/booth`)
        const allData = await allResponse.json()
        if (allData.success) {
          setBooths(allData.data || [])
          setUserLocation({ lat, lng })
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch booths. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [API_URL])

  // Load all booths (no coordinates needed)
  const loadAllBooths = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/booth`)
      if (!response.ok) throw new Error('Failed to fetch booths')
      const data = await response.json()
      if (data.success) {
        setBooths(data.data || [])
      }
    } catch (err) {
      setError('Failed to load booths. Make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  // Use current location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setIsLoading(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        fetchBoothsNearby(latitude, longitude)
      },
      error => {
        setIsLoading(false)
        if (error.code === error.PERMISSION_DENIED) {
          setError('Location access denied. Please enter your address manually or click "Load All Booths".')
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setError('Location information is unavailable.')
        } else {
          setError('An error occurred while accessing your location.')
        }
      }
    )
  }

  // Handle search by address (mock geocoding)
  const handleSearchAddress = async () => {
    if (!address.trim()) {
      setError('Please enter a city name')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const mockCoordinates = {
        'mumbai': { lat: 19.0760, lng: 72.8777 },
        'pune': { lat: 18.5204, lng: 73.8567 },
        'ahmedabad': { lat: 23.0225, lng: 72.5714 },
        'bangalore': { lat: 12.9716, lng: 77.5946 },
        'bengaluru': { lat: 12.9716, lng: 77.5946 },
        'surat': { lat: 21.1703, lng: 72.8311 },
        'mysore': { lat: 12.2958, lng: 76.6394 },
        'mysuru': { lat: 12.2958, lng: 76.6394 }
      }

      const addressLower = address.toLowerCase().trim()
      const coords = mockCoordinates[addressLower]

      if (coords) {
        fetchBoothsNearby(coords.lat, coords.lng)
        setAddress('')
      } else {
        setIsLoading(false)
        setError('City not found. Try: Mumbai, Pune, Ahmedabad, Bangalore, Surat, Mysore')
      }
    } catch (err) {
      setIsLoading(false)
      setError('Error searching for address')
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSearchAddress()
    }
  }

  const handleMapLoadError = () => {
    setMapError(true)
  }

  return (
    <div className="booth-locator">
      <div className="locator-header">
        <h2 className="locator-title">Find Your Polling Booth</h2>
        <p className="locator-subtitle">
          Locate your nearest voting center and get important details
        </p>
      </div>

      {/* Controls */}
      <div className="locator-controls">
        <div className="control-group">
          <button
            className="btn-location"
            onClick={handleUseMyLocation}
            disabled={isLoading}
            aria-label="Use my current location"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                <span>Locating...</span>
              </>
            ) : (
              <>
                <MapPin size={18} />
                <span>Use My Location</span>
              </>
            )}
          </button>
          <button
            className="btn-all-booths"
            onClick={loadAllBooths}
            disabled={isLoading}
            aria-label="Load all polling booths"
          >
            Load All Booths
          </button>
        </div>

        <div className="search-group">
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter city (e.g., Mumbai, Pune, Bangalore)"
            className="search-input"
            disabled={isLoading}
            aria-label="Enter city to search for booths"
          />
          <button
            className="btn-search"
            onClick={handleSearchAddress}
            disabled={isLoading || !address.trim()}
            aria-label="Search for booths at this location"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="booth-error" role="alert">
          <p>{error}</p>
          <button onClick={() => setError('')} className="dismiss-btn">Dismiss</button>
        </div>
      )}

      {/* Map Container — only if valid API key and no error */}
      {hasValidMapsKey && !mapError ? (
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_KEY}
          onError={handleMapLoadError}
        >
          <div className="map-container">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={userLocation}
              zoom={13}
              ref={mapRef}
              options={{
                mapTypeControl: true,
                fullscreenControl: true,
                streetViewControl: false
              }}
            >
              {/* User Location Marker */}
              <Marker
                position={userLocation}
                title="Your Location"
                icon={{
                  path: 'M0,-20 Q-20,0 0,20 Q20,0 0,-20 Z',
                  fillColor: '#1A56DB',
                  fillOpacity: 1,
                  strokeColor: 'white',
                  strokeWeight: 2,
                  scale: 1.2
                }}
              />

              {/* Booth Markers */}
              {booths.map(booth => (
                <Marker
                  key={booth.id}
                  position={{
                    lat: booth.latitude,
                    lng: booth.longitude
                  }}
                  title={booth.name}
                  onClick={() => setSelectedMarker(booth)}
                  icon={{
                    path: 'M0,-30 Q-25,0 0,35 Q25,0 0,-30 Z',
                    fillColor: '#0E9F6E',
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 2,
                    scale: 1
                  }}
                />
              ))}

              {/* Info Window */}
              {selectedMarker && (
                <InfoWindow
                  position={{
                    lat: selectedMarker.latitude,
                    lng: selectedMarker.longitude
                  }}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className="info-window-content">
                    <h4 className="booth-name">{selectedMarker.name}</h4>
                    <p><strong>Address:</strong> {selectedMarker.address}</p>
                    <p><strong>Hours:</strong> {selectedMarker.hours}</p>
                    {selectedMarker.distance && (
                      <p><strong>Distance:</strong> {selectedMarker.distance.toFixed(2)} km</p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </LoadScript>
      ) : (
        /* Fallback: No map, just show instruction */
        <div className="map-fallback">
          <div className="fallback-icon">
            <MapPin size={40} />
          </div>
          <h3>Map View Unavailable</h3>
          <p>
            {mapError
              ? 'Google Maps failed to load. Booth information is shown below.'
              : 'Google Maps API key is not configured. Use the buttons above to load booth data.'}
          </p>
        </div>
      )}

      {/* Booths List */}
      {booths.length > 0 && (
        <div className="booths-list">
          <h3 className="list-title">
            {booths.length} Booth{booths.length !== 1 ? 's' : ''} Found
          </h3>
          <div className="booths-grid">
            {booths.map(booth => (
              <div
                key={booth.id}
                className={`booth-card ${selectedMarker?.id === booth.id ? 'selected' : ''}`}
                onClick={() => setSelectedMarker(booth)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter') setSelectedMarker(booth)
                }}
                aria-label={`${booth.name}, ${booth.address}`}
              >
                <div className="booth-card-header">
                  <h4 className="booth-card-name">{booth.name}</h4>
                  {booth.distance != null && (
                    <span className="booth-distance-badge">
                      {booth.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
                <p className="booth-card-address">{booth.address}</p>
                <div className="booth-card-meta">
                  <span className="meta-item">
                    <Clock size={14} />
                    {booth.hours}
                  </span>
                </div>
                {booth.accessibilityFeatures && booth.accessibilityFeatures.length > 0 && (
                  <div className="booth-features">
                    {booth.accessibilityFeatures.map((feature, idx) => (
                      <span key={idx} className="feature-tag">
                        <Accessibility size={12} />
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {booths.length === 0 && !isLoading && !error && (
        <div className="empty-state">
          <MapPin size={48} />
          <p>No booths loaded yet</p>
          <p>Use your location or enter a city name to find booths</p>
        </div>
      )}
    </div>
  )
}

export default BoothLocator
