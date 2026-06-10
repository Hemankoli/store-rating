require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRouter = require('./modules/auth/auth.router');
const usersRouter = require('./modules/users/users.router');
const storesRouter = require('./modules/stores/stores.router');
const ratingsRouter = require('./modules/ratings/ratings.router');
const adminRouter = require('./modules/admin/admin.router');
const ownerRouter = require('./modules/owner/owner.router');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/stores', storesRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/owner', ownerRouter);

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  const errors = err.errors || [];
  res.status(status).json({ success: false, message, errors });
});

module.exports = app;
