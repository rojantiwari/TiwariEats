import { Request, Response } from "express";
import { prisma } from "../db/db.config";
import bcrypt from "bcryptjs";
import crypto from "crypto";
// import cloudinary from "../utils/cloudinary";
// import { generateVerificationCode } from "../utils/generateVerificationCode";
// import { generateToken } from "../utils/generateToken";
// import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email";


export const signup = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password, contact } = req.body;

        let user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // const verificationToken = generateVerificationCode();
        const verificationToken = "gkfnkfjdjfkfdfdhugfkg";

        user = await prisma.user.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
                contact: contact,
                verificationToken,
                verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },

        });



        //generate token
        // await sendVerificationEmail(email, verificationToken);

        const _ = require('lodash');

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: _.omit(user, ['password', 'verificationToken']),
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: "Incorrect email or password" });
        }

        // generateToken(res, user);
        await prisma.user.update({ where: { email }, data: { lastLogin: new Date() } });

        return res.status(200).json({ success: true, message: `Welcome back ${user.fullname}`, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const verifyEmail = async (req: Request, res: Response) => {
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
                verificationTokenExpiresAt: null
            },
        });

        // await sendWelcomeEmail(user.email, user.fullname);
        return res.status(200).json({ success: true, message: "Email verified successfully.", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const logout = async (_: Request, res: Response) => {
    try {
        return res.clearCookie("token").status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: "User doesn't exist" });
        }
        const resetToken = crypto.randomBytes(40).toString("hex");
        // await prisma.user.update({
        //     where: { email },
        //     data: { resetPasswordToken: resetToken, resetPasswordTokenExpiresAt: new Date(Date.now() + 3600000) },
        // });
        // await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);
        return res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                //  resetPasswordTokenExpiresAt: { gt: new Date() }
            }
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email: user.email }, data: {
                password: hashedPassword, resetPasswordToken: null,
                //  resetPasswordTokenExpiresAt: null 
            }
        });
        // await sendResetSuccessEmail(user.email);
        return res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

