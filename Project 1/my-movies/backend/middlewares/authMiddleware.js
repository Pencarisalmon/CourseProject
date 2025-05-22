import jwt from "jsonwebtoken";

import User from "../models/User.js";

import asyncHandler from "./asyncHandler.js";

const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized, no token provided" });
  }
});

const authenticateAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, not an admin" });
  }
};

export { authenticateUser, authenticateAdmin };
