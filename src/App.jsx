import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import { Container } from "@mui/material";
import tracker from "./tracker";

function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    tracker.init();

    // Check localStorage for returning user
    const hasVisitedBefore = localStorage.getItem("hasVisited");

    if (hasVisitedBefore) {
      setInitialRoute("/login");
    } else {
      localStorage.setItem("hasVisited", "true");
      setInitialRoute("/signup");
    }
  }, []);

  if (initialRoute === null) return null; // Wait until route is determined

  return (
    <Router>
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<Navigate to={initialRoute} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/survey" element={<Survey />} />
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
