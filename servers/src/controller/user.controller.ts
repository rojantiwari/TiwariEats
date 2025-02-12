import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/db.config";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateToken } from "../utils/generateToken";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail } from "../mailtrap/email";
import { generateVerificationCode } from "../utils/generateVerificationCode";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullname, email, password, contact } = req.body;

        let user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            res.status(400).json({ success: false, message: "User already exists with this email" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode(10);

        user = await prisma.user.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
                contact: String(contact),
                verificationToken: verificationToken,
                verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        await sendVerificationEmail(email, verificationToken);

        const _ = require('lodash');
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: _.omit(user, ['password', 'verificationToken']),
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: "Incorrect email or password" });

        }

        generateToken(res, user);
        await prisma.user.update({ where: { email }, data: { lastLogin: new Date() } });

        return res.status(200).json({ success: true, message: `Welcome back ${user.fullname}`, user });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { verificationCode } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: verificationCode,
                verificationTokenExpiresAt: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification token" });

        }

        await prisma.user.update({
            where: { email: user.email },
            data: {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpiresAt: null,
            },
        });

        return res.status(200).json({ success: true, message: "Email verified successfully.", user });
    } catch (error) {
        next(error);
    }
};

export const logout = async (_: Request, res: Response, next: NextFunction) => {
    try {
        return res.clearCookie("token").status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: "User doesn't exist" });

        }

        const resetToken = crypto.randomBytes(40).toString("hex");
        // Uncomment and implement the following lines if needed:
        await prisma.user.update({
            where: { email },
            data: { resetPasswordToken: resetToken, resetPasswordExpiresAt: new Date(Date.now() + 3600000) },
        });
        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);

        return res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });

        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email: user.email },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpiresAt: null,
            },
        });

        await sendResetSuccessEmail(user.email);
        return res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        next(error);
    }
};

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}


export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.id; // Assuming `req.id` contains the user ID
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullname: true,
                email: true,
                contact: true,
                address: true,
                city: true,
                country: true,
                profilePicture: true,
                admin: true,
                lastLogin: true,
                isVerified: true,
            },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });

        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.id; // Assuming `req.id` contains the user ID
        const { fullname, email, address, city, country, profilePicture } = req.body;

        let cloudResponse: any;
        if (profilePicture) {
            cloudResponse = await cloudinary.uploader.upload(profilePicture);
        }

        const updatedData = {
            fullname,
            email,
            address,
            city,
            country,
            profilePicture: cloudResponse?.secure_url || profilePicture,
        };

        const user = await prisma.user.update({
            where: { id: userId },
            data: updatedData,
            select: {
                id: true,
                fullname: true,
                email: true,
                contact: true,
                address: true,
                city: true,
                country: true,
                profilePicture: true,
                admin: true,
                lastLogin: true,
                isVerified: true,
            },
        });

        return res.status(200).json({ success: true, user, message: "Profile updated successfully" });
    } catch (error) {
        next(error);
    }
};