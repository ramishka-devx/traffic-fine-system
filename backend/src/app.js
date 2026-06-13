const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./modules/auth/auth.routes');
const fineRoutes = require('./modules/fine/fine.routes');
const paymentRoutes = require('./modules/payment/payment.routes');
const categoryRoutes = require('./modules/category/category.routes');
const officerRoutes = require('./modules/officer/officer.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const driverRoutes = require('./modules/driver/driver.routes');
const globalErrorHandler = require('./middleware/errorHandler');
const { NotFoundError } = require('./common/errors/ConcreteErrors');

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint to verify connectivity
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is reachable' });
});

// Global rate limiting to prevent brute force and DDoS attacks
const rateLimitingGuard = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP address, please try again later.'
});
app.use('/api/', rateLimitingGuard);

// Route declarations
app.use('/api/auth', authRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/officers', officerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);

// Catch-all route for unmapped paths
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot find path ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;
