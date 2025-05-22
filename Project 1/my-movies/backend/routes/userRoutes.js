import express from "express";

import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/userController.js";

import {
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticateUser, authenticateAdmin, getAllUsers);

router.route("/auth").post(loginUser);

router.route("/logout").post(logoutUser);

router
  .route("/me")
  .get(authenticateUser, getCurrentUser)
  .put(authenticateUser, updateCurrentUser);

export default router;
