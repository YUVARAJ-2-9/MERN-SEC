const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {

  // Request header-la token irukaa paakudu
  // React every request-la idha mathiri anuppum:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
  const authHeader = req.headers.authorization;

  // Token illana — access deny pannudu
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  // "Bearer eyJhbG..." → split → token part matrum edukudu
  const token = authHeader.split(' ')[1];

  try {
    // Token valid-a? Decrypt panni check pannudu
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Decoded user info-a request object-la attach pannudu
    // Now any controller can access req.user.userId
    req.user = decoded;

    // Token valid — next step ku allow pannudu (controller)
    next();

  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired, login again' });
  }
};

module.exports = { protect };