import React, { useEffect, useState } from "react";
import RoutesContainer from "./RoutesContainer";
import './App.css'
import getCSRFToken from "./csrf";
import NavBar from "./components/NavBar";
import { Container } from "@mui/material";

function App() {
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    // Retrieve the CSRF token
    async function initialize() {
      const token = await getCSRFToken();
      setCsrfToken(token); // Store the CSRF token in state
    }

    initialize();
  }, []);

    if (csrfToken === null) {
    // You can show a loading state or spinner until the CSRF token is retrieved
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <NavBar />
      <br />
      <Container maxWidth='xl'>
        <RoutesContainer />
      </Container>
    </div>
  );
}

export default App;
