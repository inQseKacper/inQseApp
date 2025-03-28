import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Note from "../components/Note";
import Apartment from "../components/Apartment";
import "../styles/Home.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import bgImage from "../assets/bgImage.jpg";
import image from "../assets/image.png";
import Dropdown from "react-bootstrap/Dropdown";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);

  // useEffect(() => {
  //   getNotes();
  // }, []);

  useEffect(() => {
    displayApartmnets();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const displayApartmnets = () => {
    api
      .get("/api/selected-owner/")
      .then((res) => res.data)
      .then((data) => {
        setApartments(data);
        console.log(data);
      })
      .catch((err) =>alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted!");
        else alert("Failed to delete note.");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note created!");
        else alert("Failed to make note.");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  return (
    <Container fluid>
      {/* GÓRNY PANEL */}
      <Row className="top align-items-center">
        <Col
          xs={12}
          md={3}
          className="d-flex justify-content-center border-end"
        >
          <img src="https://quguse.pl/img/INQSE_logo.png" alt="Logo INQSE" />
        </Col>
        <Col
          xs={12}
          md={9}
          className="position-relative d-flex justify-content-end pe-4"
        >
          <Dropdown>
            <Dropdown.Toggle
              style={{
                backgroundColor: "#f0f0f0",
                fontSize: "1vw",
                color: "black",
              }}
              variant="success"
              id="dropdown-basic"
            >
              <FontAwesomeIcon icon={faUser} className="user-icon" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/logout")}>
                Wloguj się
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* GŁÓWNY PANEL */}
      <Row>
        {/* LEWA STRONA */}
        <Col
          xs={12}
          md={3}
          className="left-navbar border-end"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "auto",
            backgroundPosition: "center",
          }}
        >
          <Row>
            <Col className="text-center mt-3">
              <h2>Panel inwestora</h2>
            </Col>
          </Row>

          {/* PRZYCISKI */}
          <Row className="mt-5">
            <Col className="d-flex justify-content-center">
              <button className="left-nav-button">
                <FontAwesomeIcon icon={faDollarSign} />
                Aktualne saldo
              </button>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="d-flex justify-content-center">
              <button className="left-nav-button">
                <FontAwesomeIcon icon={faFileLines} />
                Najnowszy raport
              </button>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="d-flex justify-content-center">
              <button className="left-nav-button">
                <FontAwesomeIcon icon={faUpload} />
                Dokument do wczytania
              </button>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="d-flex justify-content-center">
              <button className="left-nav-button">
                <FontAwesomeIcon icon={faMessage} />
                Kontakt
              </button>
            </Col>
          </Row>
        </Col>

        {/* PRAWA STRONA */}
        <Col xs={12} md={9} className="py-4 px-5 main-page">
          <Row className="g-4">
            <Col xs={12} md={6}>
              <Card className="home-card">
                <Card.Title>Aktualne Saldo</Card.Title>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="home-card mb-3">
                <Card.Title>Najnowszy raport</Card.Title>
                <Card.Text>
                  {apartments.map((apartment) => (
                    <Apartment
                      apartment={apartment}
                      key={apartment.id}
                    ></Apartment>
                  ))}
                </Card.Text>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="home-card">
                <Card.Title>Dokumenty do wczytania</Card.Title>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="home-card">
                <Card.Title>Dokumenty do wczytania</Card.Title>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>

    // <>
    //   <Container className="navbar">
    //     <Row>
    //       <Col className="left-navbar">
    //         <img src="https://quguse.pl/img/INQSE_logo.png" alt="Logo INQSE" />
    //       </Col>
    //       <Col>
    //         <FontAwesomeIcon icon={faUser} className="user-icon" />
    //       </Col>
    //     </Row>
    //   </Container>
    //   <Container>
    //     <Row>
    //       <Col>
    //         <Row className="first-row">
    //           <h2>Panel inwestora</h2>
    //         </Row>
    //         <Row className="left-nav-p">
    //           <div className="left-nav-div">
    //             <FontAwesomeIcon icon={faDollarSign} />
    //             <button className="left-nav-button">Aktualne saldo</button>
    //           </div>
    //         </Row>
    //         <Row className="left-nav-p">
    //           <div className="left-nav-div">
    //             <FontAwesomeIcon icon={faFileLines} />
    //             <button className="left-nav-button">Najnowszy raport</button>
    //           </div>
    //         </Row>
    //         <Row className="left-nav-p">
    //           <div className="left-nav-div">
    //             <FontAwesomeIcon icon={faUpload} />
    //             <button className="left-nav-button">
    //               Dokument do wczytania
    //             </button>
    //           </div>
    //         </Row>
    //         <Row className="left-nav-p">
    //           <div className="left-nav-div">
    //             <FontAwesomeIcon icon={faMessage} />
    //             <button className="left-nav-button">Kontakt</button>
    //           </div>
    //         </Row>
    //       </Col>
    //       <Col>
    //         <Row className="home-row">
    //           <Card className="home-card">
    //             <Card.Title>Aktualne Saldo</Card.Title>
    //           </Card>
    //           <Card className="home-card">
    //             <Card.Title>Najnowszy raport</Card.Title>
    //           </Card>
    //         </Row>
    //         <Row className="home-row second-home-row">
    //           <Card className="home-card">
    //             <Card.Title>Dokumenty do wczytania</Card.Title>
    //           </Card>
    //           <Card className="home-card">
    //             <Card.Title>Dokumenty do wczytania</Card.Title>
    //           </Card>
    //         </Row>
    //       </Col>
    //     </Row>
    //   </Container>
    // </>
    // <div>
    //     <div>
    //         <h2>Notes</h2>
    //         {notes.map((note) => (
    //             <Note note={note} onDelete={deleteNote} key={note.id} />
    //         ))}
    //     </div>
    //     <h2>Create a Note</h2>
    //     <form onSubmit={createNote}>
    //         <label htmlFor="title">Title:</label>
    //         <br />
    //         <input
    //             type="text"
    //             id="title"
    //             name="title"
    //             required
    //             onChange={(e) => setTitle(e.target.value)}
    //             value={title}
    //         />
    //         <label htmlFor="content">Content:</label>
    //         <br />
    //         <textarea
    //             id="content"
    //             name="content"
    //             required
    //             value={content}
    //             onChange={(e) => setContent(e.target.value)}
    //         ></textarea>
    //         <br />
    //         <input type="submit" value="Submit"></input>
    //     </form>
    // </div>
  );
}

export default Home;
