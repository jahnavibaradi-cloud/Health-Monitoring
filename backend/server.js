const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const profileRoutes = require('./routes/profileRoutes');
const patientRoutes = require('./routes/patientRoutes');
const { setupRabbitMQ } = require('./config/rabbitmq');

// Load env vars BEFORE connecting to any services
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/patient', patientRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible in routes
app.set('io', io);

// Connect to DB, then start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Initialize RabbitMQ (non-fatal if unavailable)
  setupRabbitMQ().catch(err => console.warn('RabbitMQ not available, alerts disabled:', err.message));
}).catch(err => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
