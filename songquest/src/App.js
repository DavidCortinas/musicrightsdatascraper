import React, { useEffect, useState } from "react";
import RoutesContainer from "./RoutesContainer";
import './App.css'
import getCSRFToken from "./csrf";
import NavBar from "./components/NavBar";
import { Container, Grid } from "@mui/material";
import SideBar from "./components/SideBar";

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
      <Grid container>
        <Grid item xs={2}>
          <SideBar />
        </Grid>
        <Grid item xs={10} position={"center"}>
          <Container maxWidth='xl'>
            <RoutesContainer />
          </Container>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
