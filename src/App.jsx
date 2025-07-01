// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Survey from "./pages/Survey";
import Friends from "./pages/Friends";
import Group from "./pages/Group";
import Progress from "./pages/Progress";
import Community from "./pages/Community";
import MovieNight from "./pages/MovieNight";
import SongsPlaylist from "./pages/SongsPlaylist";
import Party from "./pages/Party";
import Games from "./pages/Games";
import Socialize from "./pages/Socialize";
import { Container, Button } from "@mui/material";
import tracker from "./tracker";


function App() {
  // Call the tracker in a useEffect hook at the top of your component:
  useEffect(() => {
    tracker.init();
  }, []);

  return (
    <Router>
      <Container maxWidth="md">
        {/* Navigation Links */}
        <nav
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            marginBottom: "20px"
          }}
        >
          <Button variant="outlined" component={Link} to="/signup">
            Sign Up
          </Button>
          <Button variant="outlined" component={Link} to="/login">
            Login
          </Button>
          <Button variant="outlined" component={Link} to="/survey">
            Survey
          </Button>
          <Button variant="outlined" component={Link} to="/home">
            Home
          </Button>
          <Button variant="outlined" component={Link} to="/progress">
            Progress
          </Button>
          <Button variant="outlined" component={Link} to="/friends">
            Friends
          </Button>
          <Button variant="outlined" component={Link} to="/community">
            Community
          </Button>
          <Button variant="outlined" component={Link} to="/group">
            Group
          </Button>
          <Button variant="outlined" component={Link} to="/dashboard">
            Dashboard
          </Button>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/survey" element={<Survey />} />
          {/* Both / and /home render the Home component */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/community" element={<Community />} />
          <Route path="/group" element={<Group />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/movie-night" element={<MovieNight />} />
          <Route path="/songs-playlist" element={<SongsPlaylist />} />
          <Route path="/party" element={<Party />} />
          <Route path="/games" element={<Games />} />
          <Route path="/socialize" element={<Socialize />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
