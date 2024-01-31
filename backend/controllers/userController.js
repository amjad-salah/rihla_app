import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

//@desc Get All Users
//@rotue  GET /api/users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt').select('-password');
  res.status(200).json({ users });
});

//@desc Get Single User
//@rotue  GET /api/users/:id
//@access Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User Not Found');
  }

  res.status(200).json({ user });
});

//@desc Create User
//@rotue  POST /api/users
//@access Private
const createUser = asyncHandler(async (req, res) => {
  const { fullName, userName, password } = req.body;

  if (!fullName || !userName || !password) {
    res.status(400);
    throw new Error('All Fields are required!');
  }

  const user = await User.findOne({ userName });

  if (user) {
    res.status(400);
    throw new Error('User Already exists!');
  }

  const newUser = await User.create({ fullName, userName, password });

  res.status(201).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    userName: newUser.userName,
  });
});

//@desc Update User
//@rotue  PUT /api/users/:id
//@access Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User Not Found');
  }

  user.fullName = req.body.fullName || user.fullName;
  user.userName = req.body.userName || user.userName;
  user.password = req.body.password || user.password;

  const updateUser = await user.save();

  res.status(200).json({
    _id: updateUser._id,
    fullName: updateUser.fullName,
    userName: updateUser.userName,
  });
});

//@desc Delete User
//@rotue  DELETE /api/users/:id
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User Not Found');
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'User deleted successfully' });
});

//@desc Login User
//@rotue  POST /api/users/auth
//@access Public
const authUser = asyncHandler(async (req, res) => {
  //Check for defualt admin user
  const adminUser = await User.findOne({ userName: 'admin' });

  //Craete the admin user if not exists
  if (!adminUser) {
    await User.create({
      fullName: 'Admin',
      userName: 'admin',
      password: 'Admin123',
    });
  }

  const { userName, password } = req.body;

  if (!userName || !password) {
    res.status(400);
    throw new Error('All Fields are required!');
  }

  const user = await User.findOne({ userName });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
    });
  } else {
    res.status(401);
    throw new Error('Invalid Credentials');
  }
});

//@desc Logout User
//@rotue  GET /api/users/auth/
//@access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'User logged out' });
});

export {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  logoutUser,
  authUser,
};
