const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const nftsRouter = require('./routes/nftRoutes');
const userRouter = require('./routes/userRoutes');
const contactRouter = require('./routes/contactRoutes');
const utilityRouter = require('./routes/utilityRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/utility', utilityRouter);

app.use(cors());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 1 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 1 minutes!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/nfts', nftsRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/contact', contactRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
