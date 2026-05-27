import axios from "axios";

export async function getWeather(city: string) {
    const apiKey = process.env.WEATHER_API_KEY;

    const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    return response.data;
}