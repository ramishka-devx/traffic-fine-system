const app = require('./app');
const env = require('./config/env');

// Handle uncaught exceptions before starting the server
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception! Server shutting down...', err);
  process.exit(1);
});

const server = app.listen(env.PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection! Shutting down server gracefully...', err);
  server.close(() => process.exit(1));
});