import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const validUser = username === "admin";
    const validPass = await bcrypt.compare(password, process.env.DEMO_PASSWORD_HASH!);

    if (validUser && validPass) {
        const token = jwt.sign(
            { username },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        return res.json({ token });
    }
    return res.status(401).json({
        message: "Invalid credentials",
    });
});

export default router;