# VoterEdge AI - Backend

Backend server for VoterEdge AI election platform.

## Getting Started

### Prerequisites
- Node.js >= 14
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

### Running the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Registration
- `POST /api/registration` - Register a voter
- `GET /api/registration/:id` - Get registration details
- `PUT /api/registration/:id` - Update registration

### Candidates
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `GET /api/candidates/search/:query` - Search candidates

### Polling Booths
- `GET /api/booth` - Get all booths
- `GET /api/booth/:id` - Get booth by ID
- `POST /api/booth/nearby` - Find nearby booths

### Timeline
- `GET /api/timeline` - Get timeline
- `GET /api/timeline/events` - Get events

## Project Structure

```
backend/
├── routes/
├── controllers/
├── middleware/
├── data/
├── app.js
├── server.js
├── package.json
└── .env.example
```
