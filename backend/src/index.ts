import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import weatherRoutes from "./routes/weatherRoutes";
import messageRoute from "./routes/messageRoutes";
import { normaliseCity } from "./utils/normaliseCity";
import { authMiddleware } from "./middleware/auth";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Backend running");
});

app.use("/weather", authMiddleware, weatherRoutes);
app.use("/messages", authMiddleware, messageRoute(io));

io.on("connection", (socket) => {
    socket.on("joinCity", (city) => {
        socket.join(normaliseCity(city));
    })
    console.log("User connected");

    socket.on("leaveCity", (city: string) => {
        socket.leave(normaliseCity(city));
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});