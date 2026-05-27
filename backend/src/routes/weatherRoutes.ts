import { Router } from "express";
import axios from "axios";
import { getWeather } from "../services/weatherService";

const router = Router();

router.get("/:city", async (req, res) => {
    try {
        const data = await getWeather(req.params.city);

        res.json(data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return res.status(error.response.status).json({ message: "City not found "});
        }
        return res.status(500).json({ message: "Weather fetch failed" });
    }
});

export default router;