import { useState } from "react";
import "../styles/Register.css";
import "../styles/Register.css";
import api from "../api";
import { Navigate, useNavigate } from "react-router-dom";

function RequestResetPasswod() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const naigate = useNavigate()


  const handleRedirect = () => {
    setTimeout(() => {
      naigate("/")
    }, 5000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      const res = await api.post("/api/password-reset/", { email });
      setMessage("Link do resetowania hasła został wysłany.");
    } catch (error) {
      // if(error.response?.data)
      setErrorMessage(error.response?.data?.error || "Wystąpił błąd.");
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
        <button className="register-button request-btn" type="submit" onClick={handleRedirect}>Wyślij</button>
      </form>
    </div>
  );
}

export default RequestResetPasswod;
