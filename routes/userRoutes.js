import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middleware/auth-middleware.js";

// route level middleware - route protector
router.use("/changepassword", checkUserAuth);

// public routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);

// protected routes
router.post("/changeUserPassword", UserController.changeUserPassword);

export default router;
