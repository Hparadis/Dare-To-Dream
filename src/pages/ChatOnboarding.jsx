// src/pages/ChatOnboarding.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Chip,
  Button,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { extractKeywords } from "../utils/matchAlgorithm";
import { BASE_URL, sendFriendInvitation } from "../api";
import { getToken } from "../authHelpers";
import { useUser } from "../context/UserContext";
import TypewriterWelcome from "../components/TypewriterWelcome";
import AboutMeCard from "../components/AboutMeCard";

const BRAND_GRADIENT = "linear-gradient(45deg, #FF6B8B 0%, #6200EE 50%, #03DAC6 100%)";

async function saveAboutMe(userId, text) {
  await Promise.all([
    setDoc(doc(db, "Surveys", userId), { description: text, updatedAt: new Date().toISOString() }, { merge: true }),
    setDoc(doc(db, "Users", userId), { description: text, updatedAt: new Date().toISOString() }, { merge: true }),
  ]);
}

export default function ChatOnboarding() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { userId, isAuthReady } = useUser();

  // welcome -> intro -> chat
  const [stage, setStage] = useState("welcome");
  const [aboutMeSaved, setAboutMeSaved] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitingForMatch, setWaitingForMatch] = useState(false);

  const [noMatchDialogOpen, setNoMatchDialogOpen] = useState(false);
  // Holds a match result that's waiting on the person to fill in AboutMeCard
  // before we reveal it — "we ask them to put in their information so we
  // can verify who they are."
  const [verifyGate, setVerifyGate] = useState(null);

  const endRef = useRef(null);
  const liveKeywords = useMemo(() => extractKeywords(input), [input]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, verifyGate]);

  const pushMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const handleIntroSave = async (value) => {
    setSavingAbout(true);
    try {
      await saveAboutMe(userId, value);
      setAboutMeSaved(true);
    } catch (err) {
      console.error("Failed to save about-me:", err);
    } finally {
      setSavingAbout(false);
      setStage("chat");
    }
  };

  const handleIntroSkip = () => setStage("chat");

  const handleVerifySave = async (value) => {
    setSavingAbout(true);
    try {
      await saveAboutMe(userId, value);
      setAboutMeSaved(true);
      if (verifyGate) {
        pushMessage({ from: "assistant", text: "Thanks — here's who I found:", match: verifyGate });
      }
    } catch (err) {
      console.error("Failed to save about-me:", err);
    } finally {
      setSavingAbout(false);
      setVerifyGate(null);
    }
  };

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
        if (aboutMeSaved) {
          pushMessage({
            from: "assistant",
            text: "Found someone who's feeling the same way as you.",
            match: result,
          });
        } else {
          pushMessage({
            from: "assistant",
            text: "Found someone! I just need a bit of info from you first so they know who they're talking to.",
          });
          setVerifyGate(result);
        }
      } else if (result.reason === "no_keywords") {
        pushMessage({ from: "assistant", text: "Tell me a bit more about what's going on." });
      } else {
        setNoMatchDialogOpen(true);
      }
    } catch (err) {
      console.error("Match submit failed:", err);
      pushMessage({
        from: "assistant",
        text: "Something went wrong reaching the server — mind trying again in a moment?",
      });
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
      setMessages((prev) => prev.map((m, i) => (i === msgIndex ? { ...m, connectSent: true } : m)));
    } catch (err) {
      console.error("Failed to send connect invite:", err);
    }
  };

  const handleAcceptNotify = () => {
    setNoMatchDialogOpen(false);
    setWaitingForMatch(true);
    pushMessage({ from: "assistant", text: "Got it — I'll ring the bell the moment someone else feels this too." });
  };

  const handleDeclineNotify = async () => {
    setNoMatchDialogOpen(false);
    pushMessage({ from: "assistant", text: "No worries — try again anytime." });
    try {
      const token = await getToken();
      await fetch(`${BASE_URL}/api/match/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to cancel waiting entry:", err);
    }
  };

  const bell = (
    <IconButton
      onClick={() => navigate("/notifications")}
      sx={{ color: waitingForMatch ? "#FF6B8B" : "#888" }}
      aria-label="notifications"
    >
      <Badge color="error" variant="dot" invisible={!waitingForMatch}>
        {waitingForMatch ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
      </Badge>
    </IconButton>
  );

  if (!isAuthReady) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#232323" }}>
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#232323", color: "#fff" }}>
      {isDesktop && (
        <Box
          sx={{
            width: 84,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 3,
            borderRight: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {bell}
        </Box>
      )}

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", p: { xs: 2, sm: 3, md: 5 } }}>
        <Box sx={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column" }}>
          {stage === "welcome" && <TypewriterWelcome onDone={() => setStage("intro")} />}

          {stage === "intro" && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, minHeight: "60vh" }}>
              <AboutMeCard
                title="Let us know a bit about yourself"
                onSave={handleIntroSave}
                onSkip={handleIntroSkip}
                saving={savingAbout}
                allowSkip
              />
            </Box>
          )}

          {stage === "chat" && (
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
              }}
            >
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

                {verifyGate && (
                  <AboutMeCard
                    title="Tell us a bit about yourself"
                    subtitle="So whoever you're matched with knows who they're talking to."
                    onSave={handleVerifySave}
                    saving={savingAbout}
                    allowSkip={false}
                  />
                )}

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
                {!isDesktop && bell}
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
          )}
        </Box>
      </Box>

      <Dialog
        open={noMatchDialogOpen}
        onClose={handleDeclineNotify}
        PaperProps={{ sx: { background: "#242424", color: "#fff", borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>No match yet</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            Do you want to be notified if we find someone who feels the same way?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeclineNotify} sx={{ color: "#aaa" }}>
            No
          </Button>
          <Button
            variant="contained"
            onClick={handleAcceptNotify}
            sx={{ backgroundImage: BRAND_GRADIENT, color: "#fff", fontWeight: 600 }}
          >
            Yes, notify me
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
