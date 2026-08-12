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
// used via <motion.div>; base no-unused-vars doesn't track dotted JSX tags
// without eslint-plugin-react installed.
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { extractKeywords } from "../utils/matchAlgorithm";
import { detectIntent } from "../utils/intentActions";
import { BASE_URL, sendFriendInvitation } from "../api";
import { getToken } from "../authHelpers";
import { useUser } from "../context/UserContext";
import TypewriterWelcome from "../components/TypewriterWelcome";
import LoadingScreen from "../components/LoadingScreen";
import DislikesCard from "../components/DislikesCard";
import MatchCard from "../components/MatchCard";
import FeelingCard from "../components/FeelingCard";
import HangoutInviteCard from "../components/HangoutInviteCard";
import MatchFoundReveal from "../components/MatchFoundReveal";
import AboutMeCard from "../components/AboutMeCard";
import LocationHangoutDialog from "../components/LocationHangoutDialog";
import QuickChatDialog from "../components/QuickChatDialog";
import {
  BRAND_COLOR,
  BRAND_COLOR_TEXT_ON,
  BRAND_COLOR_SOFT,
  BRAND_PINK,
  BRAND_WHITE,
  BRAND_YELLOW,
  BRAND_GRAY_800,
  BRAND_GRAY_700,
  BRAND_GRAY_500,
  BRAND_GRAY_300,
  BRAND_GRAY_BORDER,
} from "../theme/brand";

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

// Stored now purely to refine the matching algorithm later — nothing reads
// this yet. Same dual-write pattern as saveAboutMe so both profile sources
// (Surveys, Users) stay in sync.
async function saveDislikes(userId, dislikes) {
  const payload = { dislikes, updatedAt: new Date().toISOString() };
  await Promise.all([
    setDoc(doc(db, "Surveys", userId), payload, { merge: true }),
    setDoc(doc(db, "Users", userId), payload, { merge: true }),
  ]);
}
// this is our save function
async function saveFeelingInfo(userId, { feeling, detail }) {
  const payload = { currentFeeling: feeling, currentFeelingDetail: detail, updatedAt: new Date().toISOString() };
  await Promise.all([
    setDoc(doc(db, "Surveys", userId), payload, { merge: true }),
    setDoc(doc(db, "Users", userId), payload, { merge: true }),
  ]);
}

// The three things the algorithm actually does. Stage 1: visible, always
// present at the top of the chat, but inert on click — the real actions
// wire up in stage 2.
const ALGORITHM_CARDS = [
  { key: "talk", icon: ForumOutlinedIcon, label: "Talk to someone", blurb: "Find someone who feels the same way", accent: BRAND_COLOR },
];

function AlgorithmCards({ onTalkClick, onHangoutClick }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)" }, gap: { xs: 0.75, sm: 1.5 }, mb: 2.5 }}>
      {ALGORITHM_CARDS.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div key={card.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }} whileHover={{ y: -2 }}>
            <Paper
              onClick={() => {
                if (card.key === "talk") onTalkClick?.();
                if (card.key === "hangout") onHangoutClick?.();
              }}
              sx={{
                p: { xs: 1, sm: 2 }, borderRadius: { xs: 2, sm: 3 }, cursor: "pointer",
                background: BRAND_GRAY_700, border: `1px solid ${BRAND_GRAY_BORDER}`,
                display: "flex", flexDirection: "column", gap: 0.5,
                transition: "border-color 0.2s ease", "&:hover": { borderColor: card.accent },
              }}
            >
              <Icon sx={{ color: card.accent }} fontSize="small" />
              <Typography variant="subtitle2" sx={{ color: BRAND_WHITE, fontWeight: 700 }}>{card.label}</Typography>
              <Typography variant="caption" sx={{ color: BRAND_GRAY_500 }}>{card.blurb}</Typography>
            </Paper>
          </motion.div>
        );
      })}
    </Box>
  );
}

export default function ChatOnboarding() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { userId, isAuthReady } = useUser();

  // welcome -> intro (dislikes) -> loading -> chat
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
  const [talkFlow, setTalkFlow] = useState(null); // null | "searching" | "found" | "info"
  const [pendingMatch, setPendingMatch] = useState(null);
  const [matchFromListener, setMatchFromListener] = useState(false);
  const [crisisCheckIn, setCrisisCheckIn] = useState(false);
  const [hangoutFlow, setHangoutFlow] = useState(null); // null | "locating" | "searching" | "found" | "info" | "invite" | "sent"
  const [hangoutMatch, setHangoutMatch] = useState(null);
  const [sendingInvite, setSendingInvite] = useState(false);

  const [locationDialog, setLocationDialog] = useState({ open: false, otherUserId: null, otherLabel: "They" });
  const [chatDialog, setChatDialog] = useState({ open: false, otherUserId: null, otherLabel: "them" });

  const endRef = useRef(null);
  const liveKeywords = useMemo(() => extractKeywords(input), [input]);

  // useEffect(() => {
  //   endRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages, verifyGate]);

  const pushMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const handleDislikesSave = async ({ dislikes }) => {
    setSavingAbout(true);
    try {
      await saveDislikes(userId, dislikes);
    } catch (err) {
      console.error("Failed to save dislikes:", err);
    } finally {
      setSavingAbout(false);
      setStage("loading");
    }
  };

  const handleDislikesSkip = () => setStage("loading");

  const handleVerifySave = async (payload) => {
    setSavingAbout(true);
    try {
      await saveAboutMe(userId, payload);
      setAboutMeSaved(true);
    } catch (err) {
      console.error("Failed to save about-me:", err);
    } finally {
      setSavingAbout(false);
      setTalkFlow(pendingMatch ? "match" : null);
    }
  };
  const revealMatch = (result, fromListener = false) => {
    setOptionsDialogOpen(false);
    setWaitingForMatch(false);
    setPendingMatch(result);
    setMatchFromListener(fromListener);
    setTalkFlow("found");
  };
  const handledMatchRef = useRef(null);
  const endMatchSession = async () => {
    handledMatchRef.current = null;
    setPendingMatch(null);
    setTalkFlow(null);
    if (userId) {
      try {
        await setDoc(doc(db, "Feelings", userId), { status: "idle", matchedWith: null }, { merge: true });
      } catch (err) {
        console.error("Failed to reset feelings status:", err);
      }
    }
  };

  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(doc(db, "Feelings", userId), (snap) => {
      const data = snap.data();
      if (
        data?.status === "matched" &&
        data.matchedWith &&
        data.matchedWith !== handledMatchRef.current &&
        !talkFlow &&
        !pendingMatch &&
        !hangoutFlow
      ) {
        handledMatchRef.current = data.matchedWith;
        revealMatch({ matched: true, matchedUserId: data.matchedWith, sharedKeywords: [] }, true);
      }
    });
    return () => unsub();
  }, [userId, talkFlow, pendingMatch]);

  const handleTalkCardClick = async () => {
    if (talkFlow || hangoutFlow) return;
    setTalkFlow("searching");
    try {
      const token = await getToken();
      const res = await fetch(`${BASE_URL}/api/match/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: "wants to talk to someone right now" }),
      });
      const result = await res.json();
      if (result.matched) {
        setPendingMatch(result);
        setMatchFromListener(false);
        setTalkFlow("found");
      } else {
        setTalkFlow(null);
        if (result.reason === "no_keywords") {
          pushMessage({ from: "assistant", text: "Tell me a bit more about what's going on." });
        } else {
          setOptionsDialogOpen(true);
        }
      }
    } catch (err) {
      console.error("Talk-to-someone submit failed:", err);
      setTalkFlow(null);
      pushMessage({ from: "assistant", text: "Something went wrong — mind trying again?" });
    }
  };
  const handleStartChat = (otherUserId) => {
    setChatDialog({ open: true, otherUserId, otherLabel: "them" });
    setTalkFlow(null);
    setPendingMatch(null);
  };
  const handleHangoutCardClick = () => {
    if (talkFlow || hangoutFlow) return;
    if (!navigator.geolocation) {
      pushMessage({ from: "assistant", text: "Your browser doesn't support location — try a different one to hang out." });
      return;
    }
    setHangoutFlow("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => submitHangoutSearch({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (err) => {
        console.error("Location permission denied or failed:", err);
        setHangoutFlow(null);
        pushMessage({ from: "assistant", text: "We need location access to find someone nearby — try again anytime." });
      }
    );
  };

  const submitHangoutSearch = async (coords) => {
    setHangoutFlow("searching");
    try {
      const token = await getToken();
      await setDoc(doc(db, "Feelings", userId), { lat: coords.lat, lng: coords.lng }, { merge: true });
      const res = await fetch(`${BASE_URL}/api/match/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: "wants to hang out with someone nearby" }),
      });
      const result = await res.json();
      if (result.matched) {
        setHangoutMatch(result);
        setHangoutFlow("found");
      } else {
        setHangoutFlow(null);
        if (result.reason === "no_keywords") {
          pushMessage({ from: "assistant", text: "Tell me a bit more about what's going on." });
        } else {
          setOptionsDialogOpen(true);
        }
      }
    } catch (err) {
      console.error("Hangout submit failed:", err);
      setHangoutFlow(null);
      pushMessage({ from: "assistant", text: "Something went wrong — mind trying again?" });
    }
  };

  const handleHangoutInfoSave = async (payload) => {
    setSavingAbout(true);
    try {
      await saveAboutMe(userId, payload);
      setAboutMeSaved(true);
    } catch (err) {
      console.error("Failed to save about-me:", err);
    } finally {
      setSavingAbout(false);
      setHangoutFlow("invite");
    }
  };

  const handleSendHangoutInvite = async (note) => {
    setSendingInvite(true);
    try {
      await sendFriendInvitation(userId, hangoutMatch.matchedUserId, note);
      setHangoutFlow("sent");
    } catch (err) {
      console.error("Failed to send hangout invite:", err);
      pushMessage({ from: "assistant", text: "Couldn't send that invite — mind trying again?" });
    } finally {
      setSendingInvite(false);
    }
  };


  const handleFeelingInfoSave = async ({ feeling, detail }) => {
    setSavingAbout(true);
    try {
      await saveFeelingInfo(userId, { feeling, detail });
    } catch (err) {
      console.error("Failed to save feeling info:", err);
    } finally {
      setSavingAbout(false);
      setTalkFlow(aboutMeSaved ? "match" : "verify");
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

      if (result.reason === "crisis_detected") {
        pushMessage({
          from: "assistant",
          text: result.resources?.message || "It sounds like you might be going through something heavy right now. You deserve real support.",
          crisis: result.resources,
        });
        setCrisisCheckIn(true);
        setLoading(false);
        return;
      }

      if (intent) {
        const partnerId = result.matched ? result.matchedUserId : null;
        if (partnerId) {
          pushMessage({ from: "assistant", text: `${intent.label} — let's set that up.` });
          if (intent.action === "location") {
            setLocationDialog({ open: true, otherUserId: partnerId, otherLabel: "They" });
          } else if (intent.action === "chat") {
            setChatDialog({ open: true, otherUserId: partnerId, otherLabel: "them" });
          }
          setWaitingForMatch(false);
          setLoading(false);
          return;
        }
      }

      if (result.matched) {
        revealMatch(result);
      } else if (result.reason === "no_keywords") {
        pushMessage({ from: "assistant", text: "Tell me a bit more about what's going on." });
      } else {
        // We genuinely don't know what to do with this yet — rather than
        // a dead end, offer concrete next steps.
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

  
  const handleAcceptNotify = async () => {
    setOptionsDialogOpen(false);
    setWaitingForMatch(true);
    pushMessage({ from: "assistant", text: "Got it — I'll ring the bell the moment someone else feels this too." });
    try {
      const token = await getToken();
      await fetch(`${BASE_URL}/api/match/confirm-waiting`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to confirm waiting status:", err);
    }
  };

  const handleCloseOptionsDialog = () => {
    setOptionsDialogOpen(false);
  };




  const bell = (
    <IconButton
      onClick={() => navigate("/notifications")}
      sx={{ color: waitingForMatch ? BRAND_COLOR : BRAND_GRAY_500 }}
      aria-label="notifications"
    >
      <Badge color="error" variant="dot" invisible={!waitingForMatch}>
        {waitingForMatch ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
      </Badge>
    </IconButton>
  );

  if (!isAuthReady) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: BRAND_GRAY_800 }}>
        <CircularProgress sx={{ color: BRAND_COLOR }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", minWidth: 0, overflowX: "hidden", boxSizing: "border-box", background: BRAND_GRAY_800, color: BRAND_WHITE }}>
      {/* {isDesktop && stage === "chat" && (
        <Box
          sx={{
            width: 100,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            pt: 3,
            borderRight: `1px solid ${BRAND_GRAY_BORDER}`,
          }}
        >
          {bell}
        </Box>
      )} */}

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center", p: stage === "chat" ? { xs: 2, sm: 3, md: 5 } : 0 }}>
        <Box sx={{ width: "100%", minWidth: 0, maxWidth: stage === "chat" ? 720 : "none", display: "flex", flexDirection: "column" }}>
          {stage === "chat" && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>{bell}</Box>
          )}

          {stage === "welcome" && <TypewriterWelcome onDone={() => setStage("intro")} />}

          {stage === "intro" && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, minHeight: "100vh", py: { xs: 4, md: 6 } }}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <DislikesCard onSave={handleDislikesSave} onSkip={handleDislikesSkip} saving={savingAbout} />
              </motion.div>
            </Box>
          )}

          {stage === "loading" && (
            <LoadingScreen
              words={["Getting things ready"]}
              onDone={() => setStage("chat")}
              typeSpeed={45}
              holdMs={900}
              loops={1}
            />
          )}

          {stage === "chat" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 4,
                  width: "100%",
                  minHeight: "75vh",
                  display: "flex",
                  flexDirection: "column",
                  background: "transparent",
                  transition: "box-shadow 0.4s ease",
                  boxShadow: talkFlow === "found" ? "0 0 40px rgba(242,169,192,0.45)" : "none",
                }}
              >
                {!talkFlow && !hangoutFlow ? (
                <>
                <AlgorithmCards onTalkClick={handleTalkCardClick} onHangoutClick={handleHangoutCardClick} />

                <Box sx={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1.5, px: 0.5 }}>
                  {messages.map((msg, i) => (
                    <Box key={i} sx={{ alignSelf: msg.from === "user" ? "flex-end" : "flex-start", maxWidth: "88%" }}>
                      <Paper
                        sx={{
                          p: 1.5,
                          borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                          background: msg.from === "user" ? BRAND_COLOR : msg.crisis ? "rgba(224,92,92,0.16)" : "rgba(255,255,255,0.08)",
                          border: msg.crisis ? "1.5px solid #e05c5c" : "none",
                          color: msg.from === "user" ? BRAND_COLOR_TEXT_ON : BRAND_WHITE,
                          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                        }}
                      >
                        <Typography variant="body2">{msg.text}</Typography>
                      </Paper>

                      {msg.crisis && (
                        <Paper sx={{ mt: 1.5, p: 2, borderRadius: 3, background: "rgba(224,92,92,0.1)", border: "1.5px solid #e05c5c" }}>
                              {msg.crisis.hotlines?.map((h) => (
                                <Box key={h.name} sx={{ mb: 1.5, "&:last-child": { mb: 0 } }}>
                                  <Typography variant="body2" sx={{ color: BRAND_WHITE, fontWeight: 700 }}>{h.name}</Typography>
                                  <Typography variant="body2" sx={{ color: BRAND_GRAY_300 }}>{h.contact}</Typography>
                                </Box>
                              ))}
                            </Paper>
                          )}
                        </Box>
                  ))}


                  {loading && (
                    <Box sx={{ alignSelf: "flex-start" }}>
                      <CircularProgress size={20} sx={{ color: BRAND_COLOR }} />
                    </Box>
                  )}
                  <div ref={endRef} />
                </Box>

                {crisisCheckIn && (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.5 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setCrisisCheckIn(false)}
                      sx={{ borderColor: "#e05c5c", color: "#e05c5c", "&:hover": { borderColor: "#e05c5c", background: "rgba(224,92,92,0.08)" } }}
                    >
                      I'm okay, continue
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => {
                        setCrisisCheckIn(false);
                        pushMessage({ from: "assistant", text: "That's okay — take your time. The resources above are here whenever you need them." });
                      }}
                      sx={{ color: BRAND_GRAY_300 }}
                    >
                      I still need a moment
                    </Button>
                  </Box>
                )}

                {liveKeywords.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1.5, mb: 0.5 }}>
                    {liveKeywords.slice(0, 8).map((kw) => (
                      <Chip
                        key={kw}
                        label={kw}
                        size="small"
                        sx={{ background: "rgba(255,255,255,0.08)", color: BRAND_GRAY_300, fontSize: "0.7rem" }}
                      />
                    ))}
                  </Box>
                )}

                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, mt: 1, minWidth: 0 }}>
                  <TextField
                    fullWidth
                    placeholder="Type how you're feeling..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    multiline
                    maxRows={4}
                    disabled={crisisCheckIn}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: BRAND_WHITE,
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "20px",
                        "& fieldset": { borderColor: BRAND_GRAY_BORDER },
                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                        "&.Mui-focused fieldset": { borderColor: BRAND_COLOR },
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleSend}
                    disabled={loading || !input.trim() || crisisCheckIn}
                    sx={{
                      background: BRAND_COLOR,
                      color: BRAND_COLOR_TEXT_ON,
                      "&:hover": { background: BRAND_COLOR, opacity: 0.9 },
                      "&.Mui-disabled": { background: BRAND_GRAY_700, color: BRAND_GRAY_500 },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>

                <Typography variant="caption" align="center" sx={{ mt: 1.5, color: BRAND_GRAY_500 }}>
                  Just type — no account needed until you want to say hi.
                </Typography>
                </>
                ) : (
                  <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", py: 2 }}>
                    {hangoutFlow === "locating" && (
                      <LoadingScreen words={["Getting your location"]} loops={Infinity} typeSpeed={45} holdMs={900} />
                    )}
                    {hangoutFlow === "searching" && (
                      <LoadingScreen words={["Finding someone nearby"]} loops={Infinity} typeSpeed={45} holdMs={900} />
                    )}
                    {hangoutFlow === "found" && (
                      <MatchFoundReveal label="Found someone nearby" onComplete={() => setHangoutFlow(aboutMeSaved ? "invite" : "info")} />
                    )}
                    {hangoutFlow === "info" && (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <AboutMeCard
                          title="Tell us a bit about yourself"
                          subtitle="So whoever you meet knows who they're meeting — this matters more for in-person plans."
                          onSave={handleHangoutInfoSave}
                          saving={savingAbout}
                          allowSkip={false}
                        />
                      </Box>
                    )}
                    {hangoutFlow === "invite" && hangoutMatch && (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <HangoutInviteCard onSend={handleSendHangoutInvite} sending={sendingInvite} />
                      </Box>
                    )}
                    {hangoutFlow === "sent" && (
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                        <Typography sx={{ color: BRAND_WHITE, fontWeight: 700 }}>Invite sent</Typography>
                        <Typography variant="body2" sx={{ color: BRAND_GRAY_300, mt: 1 }}>We'll let you know if they say yes.</Typography>
                        <Button onClick={() => { setHangoutFlow(null); setHangoutMatch(null); }} sx={{ mt: 2, color: BRAND_COLOR }}>Done</Button>
                      </Box>
                    )}
                    {talkFlow === "searching" && (
                      <LoadingScreen words={["Finding someone for you"]} loops={Infinity} typeSpeed={45} holdMs={900} />
                    )}
                    {talkFlow === "found" && (
                      <MatchFoundReveal onComplete={() => setTalkFlow(matchFromListener ? (aboutMeSaved ? "match" : "verify") : "info")} />
                    )}
                    {talkFlow === "info" && (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <FeelingCard onSave={handleFeelingInfoSave} saving={savingAbout} />
                      </Box>
                    )}
                    {talkFlow === "verify" && (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <AboutMeCard
                          title="Tell us a bit about yourself"
                          subtitle="So whoever you're matched with knows who they're talking to."
                          onSave={handleVerifySave}
                          saving={savingAbout}
                          allowSkip={false}
                        />
                      </Box>
                    )}
                    {talkFlow === "match" && pendingMatch && (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <MatchCard match={pendingMatch} onStartChat={handleStartChat} />
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            </motion.div>
          )}
        </Box>
      </Box>

      <Dialog
        open={optionsDialogOpen}
        onClose={handleCloseOptionsDialog}
        PaperProps={{ sx: { background: BRAND_GRAY_800, color: BRAND_WHITE, borderRadius: 4, border: `1px solid ${BRAND_GRAY_BORDER}`, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.3rem" }}>Still looking</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Typography variant="body2" sx={{ color: BRAND_GRAY_300, mb: 2.5 }}>
            Nobody's a match yet — we'll keep looking in the background either way.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box
              onClick={handleAcceptNotify}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.4, borderRadius: 3, cursor: "pointer", border: `1.5px solid ${BRAND_COLOR}`, background: BRAND_COLOR_SOFT, transition: "opacity 0.2s ease", "&:hover": { opacity: 0.85 } }}
            >
              <Typography variant="body2" sx={{ color: BRAND_WHITE, fontWeight: 700 }}>Notify me when someone matches</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCloseOptionsDialog} sx={{ color: BRAND_GRAY_500 }}>Close</Button>
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
        onClose={() => {
          setChatDialog((prev) => ({ ...prev, open: false }));
          endMatchSession();
        }}
        userId={userId}
        otherUserId={chatDialog.otherUserId}
        otherLabel={chatDialog.otherLabel}
      />
    </Box>
  );
}
