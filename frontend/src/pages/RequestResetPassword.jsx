import { useState } from "react";
import "../styles/Register.css";
import api from "../api";
import { useNavigate } from "react-router-dom";

function RequestResetPasswod() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      const res = await api.post("/api/password-reset/", { email });
      setMessage("Link do resetowania hasła został wysłany.");
    } catch (error) {
      console.error("Błąd resetowania hasła:", error.response?.data || error.message);
  
      if (error.response?.status === 400) {
          setErrorMessage(error.response?.data?.error || "Nieprawidłowe dane.");
      } else {
          setErrorMessage("Wystąpił błąd. Spróbuj ponownie później.");
      }
  }
  };

  return (
    <div className="centered-container">
      <form onSubmit={handleSubmit}>
        <a href="https://inqse.com/" target="_blank">
          <img
            src="https://quguse.pl/img/INQSE_logo.png"
            alt="Logo INQSE"
            className="logo"
          />
        </a>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <input
          type="email"
          placeholder="Twój email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* <button className="register-button request-btn" type="submit">
          Wyślij
        </button> */}
        <div className="flex-container">
          <button
            className="register-button verify"
            type="submit"
          >
            Wyślij
          </button>

          <button
            className="register-button verify"
            type="button"
            onClick={handleRedirect}
          >
            Logowanie
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestResetPasswod;
