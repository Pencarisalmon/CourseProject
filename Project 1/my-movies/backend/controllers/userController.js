import User from "../models/User.js";

import bcrypt from "bcryptjs";

import asyncHandler from "../middlewares/asyncHandler.js";

import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }
  const userExists = await User.find({ email });
  if (userExists.length > 0) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    createToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }
  const existsUser = await User.findOne({ email });
  if (!existsUser) {
    res.status(400);
    throw new Error("User not found");
  }
  const isPasswordCorrect = await bcrypt.compare(password, existsUser.password);
  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error("Invalid credentials");
  }
  createToken(res, existsUser._id);
  res.status(200).json({
    username: existsUser.username,
    email: existsUser.email,
    isAdmin: existsUser.isAdmin,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

const updateCurrentUser = asyncHandler(async (req, res) => {
  const currUser = await User.findById(req.user._id);

  currUser.username = req.body.username || currUser.username;
  currUser.email = req.body.email || currUser.email;
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    currUser.password = await bcrypt.hash(req.body.password, salt);
  }
  const updatedUser = await currUser.save();
  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
};
