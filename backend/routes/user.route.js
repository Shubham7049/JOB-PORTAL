import express from "express";

import {
  login,
  register,
  updateProfile,
  logout,
} from "../controllers/user.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Register
router
  .route("/register")
  .post(singleUpload, register);

// Login
router
  .route("/login")
  .post(login);

// Logout
router
  .route("/logout")
  .get(logout);

// Update Profile
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);

export default router;