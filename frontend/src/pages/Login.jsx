import { use, useState } from "react";
import api from "../api";
import "../styles/Register.css"
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Login() {
    //return <Form route="/api/token/" method="login" />
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
    
        try {
            const res = await api.post("/api/token/", {
                username,
                password
            });
    
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/");
        } catch (error) {
            console.error("Błąd rejestracji:", error);
            console.error("Szczegóły odpowiedzi:", error.response?.data);
            console.error("Status HTTP:", error.response?.status);
            alert("Błąd rejestracji: " + JSON.stringify(error.response?.data ?? "Brak szczegółów błędu"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="centered-container">
            <form onSubmit={handleSubmit} className="register-form">
            <img 
                src="https://quguse.pl/img/INQSE_logo.png" 
                alt="Logo INQSE"
                className="logo"
            />
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nazwa użytkownika"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hasło"
            />
            {loading && <LoadingIndicator />}
            <button className="register-button">Zaloguj</button>
        </form>
        </div>
    )
}

export default Login