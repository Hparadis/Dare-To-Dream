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
  Switch,
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
import { detectIntent } from "../utils/intentActions";
import { BASE_URL, sendFriendInvitation } from "../api";
import { getToken } from "../authHelpers";
import { useUser } from "../context/UserContext";
import TypewriterWelcome from "../components/TypewriterWelcome";
import AboutMeCard from "../components/AboutMeCard";
import LocationHangoutDialog from "../components/LocationHangoutDialog";
import QuickChatDialog from "../components/QuickChatDialog";
import { BRAND_COLOR, BRAND_COLOR_TEXT_ON, BRAND_COLOR_SOFT, BRAND_COLOR_GLOW } from "../theme/brand";

async function saveAboutMe(userId, { name, age, hobbies }) {
  const description = [name, age ? `${age} yrs` : null, hobbies ? `enjoys ${hobbies}` : null]
    .filter(Boolean)
    .join(" · ");
  const payload = { name, age, hobbies, description, updatedAt: new Date().toISOString() };
  await Promise.all([
    setDoc(doc(db, "Surveys", userId), payload, { merge: true }),
    setDoc(doc(db, "Users", userId), payload, { merge: true }),
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

  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  // Holds a match result that's waiting on the person to fill in AboutMeCard
  // before we reveal it — "put in their information so we can verify who
  // they are."
  const [verifyGate, setVerifyGate] = useState(null);

  // Point 3: dev/testing toggle. While ON, any action that needs a second
  // person (hang out, chat) uses YOU as that person, so the whole flow can
  // be exercised solo. Flip this off (or remove the switch) before real
  // users see this page.
  const [testMode, setTestMode] = useState(true);

  const [locationDialog, setLocationDialog] = useState({ open: false, otherUserId: null, otherLabel: "They" });
  const [chatDialog, setChatDialog] = useState({ open: false, otherUserId: null, otherLabel: "them" });

  const endRef = useRef(null);
  const liveKeywords = useMemo(() => extractKeywords(input), [input]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, verifyGate]);

  const pushMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const handleIntroSave = async (payload) => {
    setSavingAbout(true);
    try {
      await saveAboutMe(userId, payload);
      setAboutMeSaved(true);
    } catch (err) {
      console.error("Failed to save about-me:", err);
    } finally {
      setSavingAbout(false);
      setStage("chat");
    }
  };

  const handleIntroSkip = () => setStage("chat");

  const handleVerifySave = async (payload) => {
    setSavingAbout(true);
    try {
      await saveAboutMe(userId, payload);
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

    const intent = detectIntent(text);

    try {
      const token = await getToken();
      const res = await fetch(`${BASE_URL}/api/match/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      const result = await res.json();

      // Point 2: an actionable phrase ("let's hang out", "I want to chat")
      // takes priority over the emotional-match reveal — it opens the
      // relevant action dialog directly. In test mode, or once a real
      // match has just been found, "the other person" is available to
      // act against.
      if (intent) {
        const partnerId = result.matched ? result.matchedUserId : testMode ? userId : null;
        if (partnerId) {
          pushMessage({ from: "assistant", text: `${intent.label} — let's set that up.` });
          const otherLabel = !result.matched && testMode ? "You (test)" : "They";
          if (intent.action === "location") {
            setLocationDialog({ open: true, otherUserId: partnerId, otherLabel });
          } else if (intent.action === "chat") {
            setChatDialog({ open: true, otherUserId: partnerId, otherLabel: otherLabel.toLowerCase() });
          }
          setWaitingForMatch(false);
          setLoading(false);
          return;
        }
      }

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
        // Point 4: we genuinely don't know what to do with this yet —
        // rather than a dead end, offer concrete next steps.
        setOptionsDialogOpen(true);
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
    setOptionsDialogOpen(false);
    setWaitingForMatch(true);
    pushMessage({ from: "assistant", text: "Got it — I'll ring the bell the moment someone else feels this too." });
  };

  const handleDeclineNotify = async () => {
    setOptionsDialogOpen(false);
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

  const handleTalkNow = () => {
    setOptionsDialogOpen(false);
    if (testMode) {
      setChatDialog({ open: true, otherUserId: userId, otherLabel: "yourself (test)" });
    } else {
      pushMessage({ from: "assistant", text: "Once we find someone for you, you'll be able to chat right here." });
    }
  };

  const handleJoinGroupStub = () => {
    setOptionsDialogOpen(false);
    pushMessage({ from: "assistant", text: "Groups aren't live yet — but they're coming soon!" });
  };

  const bell = (
    <IconButton
      onClick={() => navigate("/notifications")}
      sx={{ color: waitingForMatch ? BRAND_COLOR : "#888" }}
      aria-label="notifications"
    >
      <Badge color="error" variant="dot" invisible={!waitingForMatch}>
        {waitingForMatch ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
      </Badge>
    </IconButton>
  );

  const testModeToggle = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Switch
        size="small"
        checked={testMode}
        onChange={(e) => setTestMode(e.target.checked)}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: BRAND_COLOR },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: BRAND_COLOR },
        }}
      />
      <Typography variant="caption" sx={{ color: "#888" }}>
        Test mode
      </Typography>
    </Box>
  );

  if (!isAuthReady) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#232323" }}>
        <CircularProgress sx={{ color: BRAND_COLOR }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#232323", color: "#fff" }}>
      {isDesktop && (
        <Box
          sx={{
            width: 100,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            pt: 3,
            borderRight: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {bell}
          {testModeToggle}
        </Box>
      )}

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", p: { xs: 2, sm: 3, md: 5 } }}>
        <Box sx={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column" }}>
          {!isDesktop && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>{testModeToggle}</Box>
          )}

          {stage === "welcome" && <TypewriterWelcome onDone={() => setStage("intro")} />}

          {stage === "intro" && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, py: { xs: 4, md: 6 } }}>
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
                        background: msg.from === "user" ? BRAND_COLOR : "rgba(255,255,255,0.08)",
                        color: msg.from === "user" ? BRAND_COLOR_TEXT_ON : "#fff",
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
                          border: `1.5px solid ${BRAND_COLOR}`,
                          boxShadow: `0 4px 20px ${BRAND_COLOR_GLOW}`,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <FavoriteIcon sx={{ color: BRAND_COLOR }} fontSize="small" />
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
                                sx={{ background: BRAND_COLOR_SOFT, color: BRAND_COLOR }}
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
                            background: BRAND_COLOR,
                            color: BRAND_COLOR_TEXT_ON,
                            fontWeight: 600,
                            "&:hover": { background: BRAND_COLOR, opacity: 0.9 },
                            "&.Mui-disabled": { background: "#444", color: "#aaa" },
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
                    <CircularProgress size={20} sx={{ color: BRAND_COLOR }} />
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
                      "&.Mui-focused fieldset": { borderColor: BRAND_COLOR },
                    },
                  }}
                />
                {!isDesktop && bell}
                <IconButton
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  sx={{
                    background: BRAND_COLOR,
                    color: BRAND_COLOR_TEXT_ON,
                    "&:hover": { background: BRAND_COLOR, opacity: 0.9 },
                    "&.Mui-disabled": { background: "#444", color: "#777" },
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
        open={optionsDialogOpen}
        onClose={handleDeclineNotify}
        PaperProps={{ sx: { background: "#242424", color: "#fff", borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>What would you like to do?</DialogTitle>
        <DialogContent sx={{ minWidth: 280 }}>
          <Typography variant="body2" sx={{ color: "#ccc", mb: 2 }}>
            We don't have an exact match yet — here's what you can do instead.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAcceptNotify}
              sx={{
                background: BRAND_COLOR,
                color: BRAND_COLOR_TEXT_ON,
                fontWeight: 600,
                justifyContent: "flex-start",
                "&:hover": { background: BRAND_COLOR, opacity: 0.9 },
              }}
            >
              Notify me when someone matches
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleTalkNow}
              sx={{ borderColor: BRAND_COLOR, color: BRAND_COLOR, justifyContent: "flex-start" }}
            >
              Talk to someone now
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleJoinGroupStub}
              sx={{ borderColor: "rgba(255,255,255,0.3)", color: "#ccc", justifyContent: "flex-start" }}
            >
              Join a group
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeclineNotify} sx={{ color: "#aaa" }}>
            No thanks
          </Button>
        </DialogActions>
      </Dialog>

      <LocationHangoutDialog
        open={locationDialog.open}
        onClose={() => setLocationDialog((prev) => ({ ...prev, open: false }))}
        userId={userId}
        otherUserId={locationDialog.otherUserId}
        otherLabel={locationDialog.otherLabel}
      />

      <QuickChatDialog
        open={chatDialog.open}
        onClose={() => setChatDialog((prev) => ({ ...prev, open: false }))}
        userId={userId}
        otherUserId={chatDialog.otherUserId}
        otherLabel={chatDialog.otherLabel}
      />
    </Box>
  );
}
