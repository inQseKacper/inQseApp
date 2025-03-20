import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/Register.css";

const VerifyCode = () => {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [resendEmail, setResendEmail] = useState("");

  const handleSubmit = async ({ email, code }, { setSubmitting }) => {
    setMessage("");
    setErrorMessage(""); // 🔥 Resetujemy błąd przy nowym żądaniu

    try {
      const res = await api.post(
        "/api/verify/",
        {
          email,
          code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Odpowiedź serwera:", res.data);
      setMessage("Konto zostało zweryfikowane!");
      alert("Konto zostało zweryfikowane!");
      navigate("/login");
    } catch (error) {
      console.error("Błąd weryfikacji:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || "Wystąpił błąd."); // 🔥 Tutaj była literówka!
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!resendEmail) {
      setErrorMessage("Podaj adres e-mail, aby wysłać kod ponownie.");
      return;
    }

    setMessage("");
    setErrorMessage("");

    try {
      const res = await api.post(
        "/api/resend-code/",
        { email: resendEmail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Nowy kod został wysłany na twój e-mail.");
    } catch (error) {
      console.error(
        "Błąd wysyłki kodu:",
        error.response?.data || error.message
      );
      setErrorMessage(
        error.response?.data?.error || "Nie udało się wysłać nowego kodu."
      );
    }
  };

  return (
    <div className="centered-container">
      <Formik initialValues={{ email: "", code: "" }} onSubmit={handleSubmit}>
        {({ isSubmitting, handleChange }) => (
          <Form>
            <a href="https://inqse.com/" target="_blank">
              <img
                src="https://quguse.pl/img/INQSE_logo.png"
                alt="Logo INQSE"
                className="logo"
              />
            </a>
            {message && <p className="success-message">{message}</p>}
            {errorMessage && (
              <p className="error-message">{errorMessage}</p>
            )}{" "}
            <Field
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={(e) => {
                handleChange(e);
                setResendEmail(e.target.value);
              }}
            />
            <ErrorMessage
              name="email"
              component="p"
              className="error-message"
            />
            <Field
              type="text"
              name="code"
              placeholder="Kod weryfikacyjny"
              required
            />
            <ErrorMessage name="code" component="p" className="error-message" />
            <div className="flex-container">
              <button
                className="register-button verify"
                type="submit"
                disabled={isSubmitting}
              >
                Zweryfikuj
              </button>
              <button
                className="register-button verify"
                type="button"
                disabled={isSubmitting}
                onClick={handleResendCode}
              >
                Wyślij kod ponownie
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VerifyCode;
