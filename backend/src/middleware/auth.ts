import {Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorised" });
    }
    
    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}