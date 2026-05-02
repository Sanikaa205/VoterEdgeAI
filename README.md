# VoterEdge AI

An intelligent election platform that provides voters with comprehensive information about candidates, polling booths, election timelines, and AI-powered personalized guidance.

## Project Overview

VoterEdge AI is a full-stack web application designed to empower voters with:
- Candidate information and profiles
- Polling booth locator
- Election timeline and updates
- AI-powered chatbot for voter guidance
- User registration and journey tracking

## Features

- **Candidate Database**: Browse and search candidates by position and party
- **Booth Locator**: Find nearest polling booths using geolocation
- **Election Timeline**: Stay updated with key election dates and events
- **AI Assistant**: Get personalized voting guidance from AI chatbot
- **User Registration**: Easy voter registration and profile management
- **Journey Tracker**: Track your voting journey and milestones

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Context API

### Backend
- Node.js
- Express.js
- RESTful API

## Project Structure

```
VoterEdge_AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── routes/
    ├── controllers/
    ├── middleware/
    ├── data/
    ├── app.js
    ├── server.js
    └── package.json
```

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

## API Documentation

See [Backend README](./backend/README.md) for detailed API documentation.

## Frontend Documentation

See [Frontend README](./frontend/README.md) for frontend setup and development guide.

## Environment Variables

### Frontend (.env.local)
- `VITE_API_URL` - Backend API URL
- `VITE_FIREBASE_*` - Firebase public client configuration
- `VITE_GOOGLE_MAPS_KEY` - Google Maps browser key

### Backend (.env)
- `PORT` - Server port
- `DB_HOST` - Database host
- `DB_NAME` - Database name
- `GEMINI_API_KEY` - Gemini AI API key
- `JWT_SECRET` - JWT secret key

Note: Gemini is used server-side via backend `/api/chat`; do not expose Gemini secrets as `VITE_*` frontend variables.

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a pull request

## License

MIT License

## Support

For support, please create an issue in the repository.
