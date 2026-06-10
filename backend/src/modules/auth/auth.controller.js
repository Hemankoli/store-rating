const authService = require('./auth.service');

const isProd = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: isProd ? 'none' : 'strict',
  secure: isProd,
  maxAge: 24 * 60 * 60 * 1000,
};

async function signup(req, res, next) {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { token, user } = await authService.login(req.body);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'strict',
    secure: isProd,
  });
  res.json({ success: true, message: 'Logged out' });
}

async function changePassword(req, res, next) {
  try {
    await authService.changePassword({ userId: req.user.id, ...req.body });
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, logout, changePassword };
