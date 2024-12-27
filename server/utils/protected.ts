import { NextFunction, Request, Response } from "express"

import asyncHandler from "express-async-handler"
import jwt, { VerifyErrors } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const protectedRoute = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    if (!req.headers.authorization) {
        return res.status(404).json({ message: "No token found" })
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided in the authorization header" });
    }

    const JWT_KEY = process.env.JWT_KEY
    if (!JWT_KEY) {
        return res.status(404).json({ message: "JWT key not found" })
    }

    jwt.verify(token, JWT_KEY, (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token expired" });
            }
            return res.status(403).json({ message: "JWT error", error: err })
        }

        req.body.userId = decoded.userId
        next()
    })
})