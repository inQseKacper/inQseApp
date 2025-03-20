import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";
import "../styles/Register.css";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .required("Hasło jest wymagane"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Hasła muszą być identyczne")
    .required("Potwierdzenie hasła jest wymagane"),
});

function ResetPassword() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setMessage("");
    setErrorMessage("");

    try {
      await api.post(`/api/password-reset-confirm/${uidb64}/${token}/`, {
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      });

      setMessage("Hasło zostało zmienione! Możesz się teraz zalogować.");
      resetForm();
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Nie udało się zresetować hasła."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="centered-container">
      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <a href="https://inqse.com/" target="_blank">
              <img
                src="https://quguse.pl/img/INQSE_logo.png"
                alt="Logo INQSE"
                className="logo"
              />
            </a>

            {message && <p className="success-message">{message}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <Field
              type="password"
              name="newPassword"
              placeholder="Nowe hasło"
            />
            <ErrorMessage name="newPassword" component="p" className="error-message" />

            <Field
              type="password"
              name="confirmPassword"
              placeholder="Potwierdź nowe hasło"
            />
            <ErrorMessage name="confirmPassword" component="p" className="error-message" />

            <button
              className="register-button request-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Zmiana hasła..." : "Zmień hasło"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ResetPassword;
