import { use, useState } from "react";
import api from "../api";
import "../styles/Register.css"
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Login() {
    //return <Form route="/api/token/" method="login" />
    const [errorMessage, setErrorMessage] = useState("");
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
      
            // 📌 **Tutaj wstawiasz swój kod do zamiany komunikatów błędów**
            if (error.response?.data) {
              if (error.response.data.detail) {
                const apiMessage = error.response.data.detail;
      
                const customMessages = {
                  "No active account found with the given credentials": "Nie znaleziono konta. Sprawdź dane logowania.",
                  "User already exists": "Ten użytkownik już istnieje.",
                  "Invalid email address": "Podano niepoprawny adres e-mail."
                };
      
                setErrorMessage(customMessages[apiMessage] || "Wystąpił błąd. Spróbuj ponownie.");
              } else {
                const fieldErrors = error.response.data;
                const customFieldMessages = {
                  "Invalid email": "Podaj poprawny adres e-mail.",
                  "Password is too short": "Hasło musi mieć co najmniej 8 znaków."
                };
      
                for (let field in fieldErrors) {
                  fieldErrors[field] = fieldErrors[field].map((msg) => customFieldMessages[msg] || msg);
                }
      
                setFieldErrors(fieldErrors);
              }
            } else {
              setErrorMessage("Nieznany błąd rejestracji.");
            }
          } finally {
            setLoading(false);
        }
    };

    return (
        <div className="centered-container">
            <form onSubmit={handleSubmit} className="register-form">
            <a href="https://inqse.com/" target="_blank">
            <img 
                src="https://quguse.pl/img/INQSE_logo.png" 
                alt="Logo INQSE"
                className="logo"
            />
            </a>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

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
            <div className="flex-container">
                <p className="register-p">Zapomniałeś hasła?</p>
                <button 
                    className="bottom-button"
                    type="button">
                    Resetuj hasło
                </button>
            </div>
            <div className="flex-container">
                <p className="register-p">Nie masz konta?</p>
                <button 
                    className="bottom-button"
                    onClick={() => navigate("/register")}
                    type="button"
                >Zarejestruj
                </button>
            </div>
        </form>
        </div>
    )
}

export default Login