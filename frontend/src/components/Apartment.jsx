import React from "react";
import "../styles/Home.css";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Apartment({ apartment, onDelete }) {
  return (
    // <p>{apartment.earnings[0]?.income}</p>
    <Col xs={12} md={10} className="py-4 px-5 main-page">
      <Row className="g-4">
        <Col xs={12} md={3}>
          <Card className="home-card">
            <Card.Title className="card-title">Nazwa apartmentu</Card.Title>
            <Card.Text className="card-text">{apartment.room_name}</Card.Text>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="home-card">
            <Card.Title className="card-title">Przychód</Card.Title>
            <Card.Text className="card-text">
              {apartment.earnings[0]?.income}
            </Card.Text>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="home-card mb-3">
            <Card.Title className="card-title">Ilość noclegów</Card.Title>
            <Card.Text className="card-text">
              {apartment.earnings[0]?.nights}
            </Card.Text>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="home-card">
            <Card.Title className="card-title">Obłożenie</Card.Title>
            <Card.Text className="card-text">
              {(apartment.earnings[0]?.occupancy * 100).toFixed(1)}%
            </Card.Text>
          </Card>
        </Col>
      </Row>
    </Col>
  );
}

export default Apartment;
