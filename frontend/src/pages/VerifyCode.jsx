import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";


const VerifyCode = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        setMessage("")
        
        try {
            const res = await api.post("/api/verify/", { email, code });
            setMessage(res.data.message);
            alert("Konto zweryfikowane! Możesz się zalogować.");
            navigate("/login");
        } catch (error) {
            console.error("Błąd weryfikacji:", error.response?.data);
            setMessage(error.response?.data.error || "Wystąpił błąd.");
        }
    };

    return (
        <div className="centered-container">
            <h2>Wpisz kod weryfikacyjny</h2>
            <form onSubmit={handleVerify}>
                <input 
                    type="email"
                    placeholder="Twój e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="text"
                    placeholder="Kod weryfikacyjny"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button type="submit">Zweryfikuj</button>
            </form>
            {message && <p className="error-message">{message}</p>}
        </div>
    );
}

export default VerifyCode;