import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";

const VerifyCode = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        setMessage("");
        try {
            const res = await api.post("/api/verify/", values, {
                headers: {
                    "Content-Type": "application/json", // 🔥 Upewniamy się, że to JSON
                },
            });

            setMessage(res.data.message);
            alert("Konto zweryfikowane! Możesz się zalogować.");
            navigate("/login");
        } catch (error) {
            console.error("Błąd weryfikacji:", error.response?.data);
            setMessage(error.response?.data.error || "Wystąpił błąd.");
        }
        setSubmitting(false);
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
