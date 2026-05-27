import { Router } from "express";
import { Server } from "socket.io";
import { normaliseCity } from "../utils/normaliseCity";

export default function messageRoutes(io: Server) {
    const router = Router();

    router.post("/", (req, res) => {
        const { city, message } = req.body;

        io.to(normaliseCity(city)).emit("message", message);

        res.json({
            success: true,
        });
    });

    return router;
}