const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ===== REGISTER =====
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Already registered-a check pannudu
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Password encrypt pannudu — NEVER plain text store pannakudathu!
    // 10 = salt rounds, higher = more secure but slower
    const hashedPassword = await bcrypt.hash(password, 10);

    // New user create pannudu
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // JWT Token create pannudu
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Token-la store agura data
      process.env.JWT_SECRET,                   // Secret key from .env
      { expiresIn: '7d' }                       // 7 days valid
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===== LOGIN =====
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User irukana check pannudu
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Entered password vs DB-la irukura hashed password compare pannudu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Token create pannudu
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login };