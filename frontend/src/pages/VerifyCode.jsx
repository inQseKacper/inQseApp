import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Formik, Form, Field, ErrorMessage } from "formik";

const VerifyCode = () => {
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");  // 🔥 Dodałem obsługę błędu
    const navigate = useNavigate();

    const handleSubmit = async ({ email, code }, { setSubmitting }) => {
        setMessage("");
        setErrorMessage(""); // 🔥 Resetujemy błąd przy nowym żądaniu

        try {
            const res = await api.post("/api/verify/", {
                email,
                code
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            console.log("Odpowiedź serwera:", res.data);
            setMessage("Konto zostało zweryfikowane!");
            alert("Konto zostało zweryfikowane!");
            navigate('/login');
        } catch (error) {
            console.error("Błąd weryfikacji:", error.response?.data || error.message);
            setErrorMessage(error.response?.data?.error || "Wystąpił błąd.");  // 🔥 Tutaj była literówka!
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="centered-container">
            <h2>Weryfikacja konta</h2>
            {message && <p className="success-message">{message}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* 🔥 Wyświetlenie błędu */}

            <Formik
                initialValues={{ email: "", code: "" }}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Field type="email" name="email" placeholder="Email" required />
                        <ErrorMessage name="email" component="p" className="error-message" />

                        <Field type="text" name="code" placeholder="Kod weryfikacyjny" required />
                        <ErrorMessage name="code" component="p" className="error-message" />

                        <button type="submit" disabled={isSubmitting}>Zweryfikuj</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default VerifyCode;
