import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <Container fluid>
      {/* GÓRNY PANEL */}
      <Row className="top align-items-center">
        <Col
          xs={12}
          md={2}
          className="d-flex justify-content-center border-end"
        >
          <Link to="/">
            <img
              src="https://quguse.pl/img/INQSE_logo.png"
              alt="Logo INQSE"
              className="img-fluid"
            />
          </Link>
        </Col>
        <Col
          xs={12}
          md={10}
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
          md={2}
          className="left-navbar border-end"
          // style={{
          //   backgroundImage: `url(${image})`,
          //   backgroundSize: "auto",
          //   backgroundPosition: "center",
          // }}
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
              <button
                className="left-nav-button"
                onClick={() => navigate("/contact")}
              >
                <FontAwesomeIcon icon={faMessage} />
                Kontakt
              </button>
            </Col>
          </Row>
        </Col>
        {children}
      </Row>
    </Container>
  );
}

export default Layout;
