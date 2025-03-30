import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Apartment from "../components/Apartment";
import "../styles/Home.css";
import Layout from "../layout/layout";

function Home() {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    displayApartmnets();
  }, []);


  const displayApartmnets = () => {
    api
      .get("/api/selected-owner/")
      .then((res) => res.data)
      .then((data) => {
        setApartments(data.apartments);
        console.log(data.apartments);
      })
      .catch((err) =>console.log(err));
  };

  return (
    <Layout>
      {apartments.map((apartment) => (
        <Apartment apartment={apartment} key={apartment.id} />
      ))}
    </Layout>
  );
}

export default Home;