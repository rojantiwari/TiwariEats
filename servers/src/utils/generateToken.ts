import jwt from "jsonwebtoken";
import { Response } from "express";
import { User } from "@prisma/client";



export const generateToken = (res: Response, user: User) => {
    const token = jwt.sign(
        { userId: user.id },
        process.env.SECRET_KEY!,
        {
            expiresIn: '1d'
        });

    res.cookie
        (
            "token",
            token,
            {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            }
        );
    return token;
}