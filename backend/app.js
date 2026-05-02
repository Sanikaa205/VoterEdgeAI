import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import registrationRoutes from './routes/registration.js';
import candidateRoutes from './routes/candidates.js';
import boothRoutes from './routes/booth.js';
import timelineRoutes from './routes/timeline.js';
import chatRoutes from './routes/chat.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware with custom CSP for Google APIs
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://apis.google.com",
        "https://*.googleapis.com",
        "https://maps.googleapis.com",
        "https://cdn.jsdelivr.net",
        "https://www.gstatic.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://maps.googleapis.com",
        "https://*.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://*.gstatic.com"
      ],
      connectSrc: [
        "'self'",
        "https://apis.google.com",
        "https://*.googleapis.com",
        "https://generativelanguage.googleapis.com",
        "https://www.googleapis.com",
        "https://maps.googleapis.com",
        "https://firestore.googleapis.com",
        "https://*.firebaseio.com",
        "https://*.firebase.googleapis.com",
        "https://*.firebaseapp.com",
        "https://*.firebase.com"
      ],
      imgSrc: [
        "'self'",
        "https:",
        "data:"
      ],
      mediaSrc: ["'self'"],
      frameSrc: [
        "'self'",
        "https://maps.google.com",
        "https://*.google.com",
        "https://*.googleapis.com",
        "https://*.firebaseapp.com",
        "https://*.firebase.com",
        "https://firebase.google.com"
      ]
    }
  }
}));

// CORS middleware
const defaultAllowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const configuredOrigins = String(process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredOrigins]);

const corsOptionsDelegate = (req, callback) => {
  const requestOrigin = req.header('Origin');

  // Allow non-browser clients (e.g. Postman) with no Origin header.
  if (!requestOrigin) {
    return callback(null, {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });
  }

  const forwardedHost = req.header('x-forwarded-host');
  const requestHost = forwardedHost || req.header('host');

  let isSameOrigin = false;
  try {
    isSameOrigin = requestHost ? new URL(requestOrigin).host === requestHost : false;
  } catch {
    isSameOrigin = false;
  }

  const isAllowed = isSameOrigin || allowedOrigins.has(requestOrigin);

  return callback(null, {
    origin: isAllowed,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
};

app.use(cors(corsOptionsDelegate));
app.options('*', cors(corsOptionsDelegate));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiter middleware (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/registration', registrationRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/booth', boothRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/chat', chatRoutes);

// Serve frontend build (static files)
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');

app.use(express.static(frontendDist));

// Fallback: serve index.html for non-API routes (SPA)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  return res.sendFile(path.join(frontendDist, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    error: message,
    status,
    timestamp: new Date().toISOString()
  });
});

export default app;
