import express from "express";

import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";



// ✅ Utility function to handle async errors correctly
const asyncHandler = (fn: any) =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

const router = express.Router();

router.route("/check-auth").get(asyncHandler(isAuthenticated), asyncHandler(checkAuth));
router.route("/signup").post(asyncHandler(signup));
router.route("/login").post(asyncHandler(login));
router.route("/logout").post(asyncHandler(logout));
router.route("/verify-email").post(asyncHandler(verifyEmail));
router.route("/forgot-password").post(asyncHandler(forgotPassword));
router.route("/reset-password/:token").post(asyncHandler(resetPassword));
router.route("/profile/update").put(asyncHandler(isAuthenticated), asyncHandler(updateProfile));

export default router;