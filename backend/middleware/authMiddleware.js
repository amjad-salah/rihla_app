import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asynchandler from 'express-async-handler';

const protect = asynchandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      res.status(401);

      throw new Error('Not Authorized!');
    }
  } else {
    res.status(401);

    throw new Error('Not Authorized!');
  }
});

export default protect;
