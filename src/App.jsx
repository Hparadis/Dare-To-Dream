import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "@mui/material";

import ChatOnboarding from "./pages/ChatOnboarding";
import Notifications from "./pages/Notifications";

// ───────────────────────────────────────────────────────────────────────
// Everything below is intentionally OFF while we test the chat-matching
// idea. Nothing was deleted — to bring a page back: uncomment its import
// above the component definition AND its <Route> below. That's it.
// ───────────────────────────────────────────────────────────────────────
// import SignupPage from "./pages/SignupPage";
// import LoginPage from "./pages/LoginPage";
// import Dashboard from "./pages/Dashboard";
// import Home from "./pages/Home";
// import Survey from "./pages/Survey";
// import Friends from "./pages/Friends";
// import Group from "./pages/Group";
// import Progress from "./pages/Progress";
// import Community from "./pages/Community";
// import MovieNight from "./pages/MovieNight";
// import SongsPlaylist from "./pages/SongsPlaylist";
// import Party from "./pages/Party";
// import Games from "./pages/Games";
// import Socialize from "./pages/Socialize";

function App() {
  return (
    <Router>
      <Container maxWidth={false} disableGutters>
        <Routes>
          <Route path="/" element={<ChatOnboarding />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* <Route path="/signup" element={<SignupPage />} /> */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/survey" element={<Survey />} /> */}
          {/* <Route path="/home" element={<Home />} /> */}
          {/* <Route path="/progress" element={<Progress />} /> */}
          {/* <Route path="/friends" element={<Friends />} /> */}
          {/* <Route path="/community" element={<Community />} /> */}
          {/* <Route path="/group" element={<Group />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/movie-night" element={<MovieNight />} /> */}
          {/* <Route path="/songs-playlist" element={<SongsPlaylist />} /> */}
          {/* <Route path="/party" element={<Party />} /> */}
          {/* <Route path="/games" element={<Games />} /> */}
          {/* <Route path="/socialize" element={<Socialize />} /> */}

          {/* Any stale/bookmarked URL (like the old /login) just bounces home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
