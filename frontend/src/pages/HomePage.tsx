import { useState } from "react";
import axios from "axios";
import { disconnectSocket, getSocket } from "../services/socket";
import { useEffect } from "react";
import {useNavigate } from "react-router-dom";
import { normaliseCity } from "../util/normaliseCity";

interface WeatherData {
    name: string;
    main: { temp: number };
    weather: { description: string }[];
}

function HomePage() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [liveMessage, setLiveMessage] = useState("");
    const [currentRoom, setCurrentRoom] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        disconnectSocket();
        navigate("/");
    }

    const fetchWeather = async () => {
        try {
            setError("");
            const token = localStorage.getItem("token");
            const normalisedCity = normaliseCity(city);
            const response = await axios.get(
                `http://localhost:3000/weather/${city}`,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setWeather(response.data);

            if (currentRoom) {
                getSocket().emit("leaveCity", currentRoom);
            }

            getSocket().emit("joinCity", normalisedCity);
            setCurrentRoom(normalisedCity);
        } catch {
            setError("City not found or weather unavailable.");
        }
    };

    useEffect(() => {
        const socket = getSocket();
        socket.on("message", (message) => {
            setLiveMessage(message);
            setTimeout(() => setLiveMessage(""), 5000);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Weather</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <input
                placeholder="Enter city"
                onChange={(e) => setCity(e.target.value)}
            />

            <button onClick={fetchWeather}>
                Get Weather
            </button>

            {weather && (
                <div>
                    <h2>{weather.name}</h2>
                    <p>{weather.main.temp} °C</p>
                    <p>{weather.weather[0].description}</p>
                </div>
            )}
            {liveMessage && (
                <div
                    style={{
                        position: "fixed",
                        top: 20,
                        right: 20,
                        background: "#222",
                        color: "white",
                        padding: "16px",
                        borderRadius: "8px",
                    }}
                >
                    {liveMessage}
                </div>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default HomePage;