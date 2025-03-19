import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../styles/Register.css";
import LoadingIndicator from "../components/LoadingIndicator";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";

const initialValues = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  first_name: Yup.string().required("Imię jest wymagane"),
  last_name: Yup.string().required("Nazwisko jest wymagane"),
  username: Yup.string().required("Nazwa użytkownika jest wymagana"),
  email: Yup.string().email("Niepoprawny email").required("Email jest wymagany"),
  password: Yup.string().min(8, "Hasło musi mieć co najmniej 8 znaków").required("Hasło jest wymagane"),
});

function Register() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="centered-container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur={true}
        validateOnChange={true}
        onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
          setLoading(true);
          setErrorMessage("");

          try {
            const res = await api.post("/api/user/register/", values);

            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

            console.log("Rejestracja udana:", res.data);
            resetForm();
            setSubmitting(false);
            navigate("/verify");
          } catch (error) {
            console.error("Błąd rejestracji:", error);

            if (error.response?.data) {
              if (error.response.data.detail) {
                setErrorMessage(error.response.data.detail);
              } else {
                setErrors(error.response.data); // Ustawienie błędów Formika
              }
            } else {
              setErrorMessage("Nieznany błąd rejestracji.");
            }
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="register-form">
            <a href="https://inqse.com/" target="blank">
              <img src="https://quguse.pl/img/INQSE_logo.png" alt="Logo INQSE" className="logo" />
            </a>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <Field type="text" name="first_name" placeholder="Imię" />
            <ErrorMessage name="first_name" component="p" className="error-message" />

            <Field type="text" name="last_name" placeholder="Nazwisko" />
            <ErrorMessage name="last_name" component="p" className="error-message" />

            <Field type="text" name="username" placeholder="Nazwa użytkownika" />
            <ErrorMessage name="username" component="p" className="error-message" />

            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="p" className="error-message" />

            <Field type="password" name="password" placeholder="Hasło" />
            <ErrorMessage name="password" component="p" className="error-message" />

            {loading && <LoadingIndicator />}

            <button className="register-button" type="submit" disabled={isSubmitting}>
              Zarejestruj
            </button>

            <div className="flex-container">
              <p className="register-p">Masz już konto?</p>
              <button className="bottom-button" onClick={() => navigate("/login")} type="button">
                Zaloguj
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;
