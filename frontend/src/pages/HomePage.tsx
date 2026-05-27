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
        <div className="min-h-screen bg-gray-900">
            <header className="bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-white">Weather App</h1>
                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                    Logout
                </button>
            </header>
    
            <main className="max-w-md mx-auto mt-12 px-4">
                <div className="flex gap-2">
                    <input
                        className="flex-1 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter city"
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button
                        onClick={fetchWeather}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
                    >
                        Search
                    </button>
                </div>
    
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    
                {weather && (
                    <div className="mt-6 bg-gray-800 rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-white">{weather.name}</h2>
                        <p className="text-4xl font-light text-blue-400 mt-2">{weather.main.temp}°C</p>
                        <p className="text-gray-300 capitalize mt-1">{weather.weather[0].description}</p>
                    </div>
                )}
            </main>
            
            {liveMessage && (
                <div className="fixed top-5 right-5 bg-gray-700 text-white text-sm px-4 py-3 rounded-lg shadow-lg max-w-xs">
                    {liveMessage}
                </div>
            )}
        </div>
    );
}

export default HomePage;