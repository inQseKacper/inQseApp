import Layout from "../layout/layout";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import "../styles/Home.css";
import "../styles/Contact.css";
import Button from "react-bootstrap/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import { faWheatAwn } from "@fortawesome/free-solid-svg-icons";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";


const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  email_subject: "",
  email_message: "",
};

const validationSchema = Yup.object({
  first_name: Yup.string().required("Imie jest wymagane"),
  last_name: Yup.string().required("Nazwisko jest wymagane"),
  email: Yup.string()
    .email("Niepoprawny email")
    .required("Email jest wymagany"),
  email_subject: Yup.string().required("Temat jest wymagany"),
  email_message: Yup.string().required("Wiadomość jest wymagana"),
});

function Contact() {
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState("")
  return (
    <Layout>
        <Col xs={12} md={10} style = {{backgroundColor: "#f0f0f0"}}>
          <h3 style={{marginTop: "1.5vh", marginLeft: "1.5vh"}}>Nowa Wiadomomość</h3>
          <div className="contact-col">
            <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={async (values, { resetForm }) => {
                setLoading
                setErrorMessage();

                try {
                  const res = await api.post('/api/contact/', values);

                  localStorage.setItem(ACCESS_TOKEN, res.data.access);
                  localStorage.setItem(REFRESH_TOKEN, res.data.refresh)

                  console.log("Wiadomość wysłana");
                  resetForm();
                } catch(error) {
                  console.error("Błąd przy rejestracji: ", error)
                }
              }}
            >
                {({isSubmitting}) => (
                    <Form className="contact-form">

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <Field name="first_name" placeholder="Imię"/>
                        <ErrorMessage name="first_name" component="p" className="error-message" />
                        
                        <Field name="last_name" placeholder="Nazwisko"/>
                        <ErrorMessage name="last_name" component="p" className="error-message" />
                        
                        <Field name="email" placeholder="Email" />
                        <ErrorMessage name="email" component="p" className="error-message" />

                        <Field name="email_subject" placeholder="Temat wiadomości" />
                        <ErrorMessage name="email_subject" component="p" className="error-message" />
                        
                        <Field name="email_message" placeholder="Wiadomość" as="textarea"/>
                        <ErrorMessage name="email_message" component="p" className="error-message" />

                        <button type="submit" disabled={isSubmitting}>Wyślij</button>
                    </Form>
                )}
            </Formik>
          </div>
        </Col>
    </Layout>
  );
}

export default Contact;
