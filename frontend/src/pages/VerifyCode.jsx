import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";

const VerifyCode = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        const formattedValues = {
            email: values.email,
            code: String(values.code)  // Konwersja kodu na string
        };

        setMessage("");
        try {
            const res = await api.post("/api/verify/", formattedValues, {
                headers: { "Content-Type": "application/json" }
            });
    
            console.log("Weryfikacja udana:", res.data);
            alert("Konto zostało aktywowane!");
            navigate("/login");
        } catch (error) {
            console.error("Błąd weryfikacji:", error);
            
            if (error.response) {
                console.error("Odpowiedź serwera:", error.response.data);
                alert(`Błąd weryfikacji: ${error.response.data.error || "Nieznany błąd!"}`);
            } else {
                alert("Nie udało się nawiązać połączenia z serwerem.");
            }
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="centered-container">
            <h2>Weryfikacja konta</h2>
            {message && <p>{message}</p>}
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
