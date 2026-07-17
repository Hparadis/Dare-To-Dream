// src/pages/ChatOnboarding.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Chip,
  Button,
  Badge,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { extractKeywords } from "../utils/matchAlgorithm";
import { BASE_URL, sendFriendInvitation } from "../api";
import { getToken } from "../authHelpers";
import { useUser } from "../context/UserContext";

const GREETING = "Hi, I'm here to help you find someone who gets it. What's going on?";
// Same pink → purple → teal gradient already used on the avatar hover
// border in AppHeader.jsx — reused here as the one bold, signature accent.
const BRAND_GRADIENT = "linear-gradient(45deg, #FF6B8B 0%, #6200EE 50%, #03DAC6 100%)";

export default function ChatOnboarding() {
  const navigate = useNavigate();
  const { userId, isAuthReady } = useUser();

  const [messages, setMessages] = useState([{ from: "assistant", text: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitingForMatch, setWaitingForMatch] = useState(false);
  const endRef = useRef(null);

  // Live "words we're picking up" preview — makes the (deliberately
  // simple) algorithm visible to the person typing, instead of a black box.
  const liveKeywords = useMemo(() => extractKeywords(input), [input]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const pushMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || !userId) return;

    pushMessage({ from: "user", text });
    setInput("");
    setLoading(true);

    try {
      const token = await getToken();
      const res = await fetch(`${BASE_URL}/api/match/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      const result = await res.json();

      if (result.matched) {
        setWaitingForMatch(false);
        pushMessage({
          from: "assistant",
          text: "Found someone who's feeling the same way as you.",
          match: result,
        });
      } else if (result.reason === "no_keywords") {
        pushMessage({ from: "assistant", text: "Tell me a bit more about what's going on." });
      } else {
        setWaitingForMatch(true);
        pushMessage({
          from: "assistant",
          text: "No match yet — but I've got you. I'll ring the bell the moment someone else feels this too.",
          waiting: true,
        });
      }
    } catch (err) {
      console.error("Match submit failed:", err);
      pushMessage({ from: "assistant", text: "Something went wrong — mind trying again?" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConnect = async (matchedUserId, msgIndex) => {
    try {
      await sendFriendInvitation(userId, matchedUserId);
      setMessages((prev) =>
        prev.map((m, i) => (i === msgIndex ? { ...m, connectSent: true } : m))
      );
    } catch (err) {
      console.error("Failed to send connect invite:", err);
    }
  };

  if (!isAuthReady) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          width: "100%",
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: 2,
            fontFamily: "Poppins, Segoe UI",
            fontWeight: 700,
            backgroundImage: BRAND_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Dare To Dream
        </Typography>

        <Box sx={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1.5, px: 0.5 }}>
          {messages.map((msg, i) => (
            <Box key={i} sx={{ alignSelf: msg.from === "user" ? "flex-end" : "flex-start", maxWidth: "88%" }}>
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.from === "user" ? "#ff6f61" : "rgba(255,255,255,0.08)",
                  color: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Paper>

              {msg.match && (
                <Paper
                  sx={{
                    mt: 1.5,
                    p: 2,
                    borderRadius: 3,
                    background: "rgba(20,20,20,0.9)",
                    backgroundImage: `linear-gradient(rgba(20,20,20,0.92), rgba(20,20,20,0.92)), ${BRAND_GRADIENT}`,
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                    border: "1px solid transparent",
                    boxShadow: "0 4px 20px rgba(98,0,238,0.35)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <FavoriteIcon sx={{ color: "#FF6B8B" }} fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      It's a match
                    </Typography>
                  </Box>
                  {msg.match.sharedKeywords?.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
                      {msg.match.sharedKeywords.map((kw) => (
                        <Chip
                          key={kw}
                          label={kw}
                          size="small"
                          sx={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
                        />
                      ))}
                    </Box>
                  )}
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={msg.connectSent}
                    onClick={() => handleConnect(msg.match.matchedUserId, i)}
                    sx={{
                      backgroundImage: BRAND_GRADIENT,
                      color: "#fff",
                      fontWeight: 600,
                      "&:hover": { opacity: 0.9, backgroundImage: BRAND_GRADIENT },
                      "&.Mui-disabled": { backgroundImage: "none", background: "#444", color: "#aaa" },
                    }}
                  >
                    {msg.connectSent ? "Invite sent" : "Say hi"}
                  </Button>
                </Paper>
              )}
            </Box>
          ))}
          {loading && (
            <Box sx={{ alignSelf: "flex-start" }}>
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            </Box>
          )}
          <div ref={endRef} />
        </Box>

        {liveKeywords.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1.5, mb: 0.5 }}>
            {liveKeywords.slice(0, 8).map((kw) => (
              <Chip
                key={kw}
                label={kw}
                size="small"
                sx={{ background: "rgba(255,255,255,0.08)", color: "#ccc", fontSize: "0.7rem" }}
              />
            ))}
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, mt: 1 }}>
          <TextField
            fullWidth
            placeholder="Type how you're feeling..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "20px",
                "& fieldset": { borderColor: "rgba(255,255,255,0.25)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                "&.Mui-focused fieldset": { borderColor: "#ff6f61" },
              },
            }}
          />
          <IconButton
            onClick={() => navigate("/notifications")}
            sx={{ color: waitingForMatch ? "#FF6B8B" : "#888" }}
            aria-label="notifications"
          >
            <Badge color="error" variant="dot" invisible={!waitingForMatch}>
              {waitingForMatch ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
            </Badge>
          </IconButton>
          <IconButton
            onClick={handleSend}
            disabled={loading || !input.trim()}
            sx={{
              backgroundImage: BRAND_GRADIENT,
              color: "#fff",
              "&:hover": { opacity: 0.9 },
              "&.Mui-disabled": { backgroundImage: "none", background: "#444", color: "#777" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        <Typography variant="caption" align="center" sx={{ mt: 1.5, color: "#888" }}>
          Just type — no account needed until you want to say hi.
        </Typography>
      </Paper>
    </Container>
  );
}
