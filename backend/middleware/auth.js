const jwt = require('jsonwebtoken');
const JWT_SECRET = 'mysecretkey';

function auth(req, res, next) {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ msg: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;