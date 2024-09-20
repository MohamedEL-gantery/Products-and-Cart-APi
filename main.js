const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const AppError = require('./utils/appError');
const errorHandler = require('./utils/errorHandler');
const connectDB = require('./dataBase');
const mountRoutes=require("./routes")

// Load environment variables
dotenv.config({ path: '.env' });

// Initialize the express application
const app = express();

// Middleware
app.use(express.json());

// Serve static files from the 'public' directory
app.use('/uploads', express.static(path.join(__dirname, 'public')));

// Use morgan for logging only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Connect to the database before starting the server
connectDB();

// Routes
mountRoutes(app);

// Catch-all route for undefined routes
app.all('*', (req, res, next) => {
  next(AppError.notFound(`Cannot find ${req.originalUrl} on this server!`));
});

// Global error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'http://localhost';

app.listen(PORT, () => {
  console.log(
    `The API is running on ${HOST}:${PORT} in ${process.env.NODE_ENV} environment!`
  );
});
