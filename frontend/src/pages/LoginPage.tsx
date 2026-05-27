import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:3000/auth/login",
                {
                    username,
                    password,
                }
            );

            localStorage.setItem("token", response.data.token);

            navigate("/home");
        } catch {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 rounded-xl shadow-md p-8 w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-white mb-6">Sign in</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
