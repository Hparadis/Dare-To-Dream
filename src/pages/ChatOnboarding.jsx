import React, { useState, useRef, useEffect } from "react";
import {
  Box, Paper, Typography, TextField, IconButton, Button,
  Chip, CircularProgress, Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import GroupsIcon from "@mui/icons-material/Groups";
import { getAuth, signInAnonymously } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { extractIntent } from "../utils/intentMatcher";
import { BASE_URL, fetchGroups, fetchCommunities } from "../api";
import { joinGroup as joinGroupFirestore, joinCommunity as joinCommunityFirestore } from "../api/firebaseApi";

const PROBLEM_OPTIONS = [
  { value: "depression", label: "Feeling down / depressed" },
  { value: "addiction", label: "A habit or addiction" },
];
const CAUSE_OPTIONS = [
  { value: "family", label: "Family" },
  { value: "relationship", label: "A relationship" },
  { value: "society", label: "Social / work / school" },
  { value: "self-inflicted", label: "Myself" },
  { value: "others", label: "Something else" },
];

let idCounter = 0;
const nextId = () => `m${++idCounter}`;

export default function ChatOnboarding() {
  const { userId, isAuthReady } = useUser();
  const navigate = useNavigate();
  const auth = getAuth();

  const [messages, setMessages] = useState([
    {
      id: nextId(),
      from: "bot",
      type: "text",
      text: "Hi, I'm here to help you find the right people. What's going on? You can write it in your own words — e.g. \"I feel lonely\" or \"I'm struggling with drinking.\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("awaiting_input");
  const [draftIntent, setDraftIntent] = useState({ problem: null, cause: null, rawText: "" });
  const bottomRef = useRef(null);

  // Guests get a real uid immediately so chat/match data has somewhere to live.
  useEffect(() => {
    if (isAuthReady && !auth.currentUser) {
      signInAnonymously(auth).catch((err) => console.error("Anonymous sign-in failed:", err));
    }
  }, [isAuthReady]);

  // Already fully signed in (not a guest)? Skip straight to Home.
  useEffect(() => {
    if (isAuthReady && auth.currentUser && !auth.currentUser.isAnonymous) {
      navigate("/home");
    }
  }, [isAuthReady]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const pushMessage = (msg) => setMessages((prev) => [...prev, { id: nextId(), ...msg }]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    pushMessage({ from: "user", type: "text", text });
    setInput("");
    processFreeText(text);
  };

  const processFreeText = (text) => {
    const intent = extractIntent(text);
    const merged = {
      ...draftIntent,
      rawText: draftIntent.rawText ? `${draftIntent.rawText} ${text}` : text,
    };
    if (!merged.problem && intent.problemConfident) merged.problem = intent.problem;
    if (!merged.cause && intent.causeConfident) merged.cause = intent.cause;
    setDraftIntent(merged);

    if (!merged.problem) {
      setStage("clarify_problem");
      pushMessage({
        from: "bot", type: "quick-replies",
        text: "Thanks for sharing that. Which of these feels closest to what you're dealing with?",
        options: PROBLEM_OPTIONS,
        onSelect: (value) => handleProblemPick(value, merged),
      });
      return;
    }
    if (!merged.cause) {
      setStage("clarify_cause");
      pushMessage({
        from: "bot", type: "quick-replies",
        text: "Got it. What's mainly behind it?",
        options: CAUSE_OPTIONS,
        onSelect: (value) => handleCausePick(value, merged),
      });
      return;
    }
    runMatching(merged);
  };

  const handleProblemPick = (value, base = draftIntent) => {
    const merged = { ...base, problem: value };
    setDraftIntent(merged);
    pushMessage({ from: "user", type: "text", text: PROBLEM_OPTIONS.find((o) => o.value === value)?.label || value });
    if (!merged.cause) {
      setStage("clarify_cause");
      pushMessage({
        from: "bot", type: "quick-replies", text: "What's mainly behind it?",
        options: CAUSE_OPTIONS, onSelect: (v) => handleCausePick(v, merged),
      });
    } else {
      runMatching(merged);
    }
  };

  const handleCausePick = (value, base = draftIntent) => {
    const merged = { ...base, cause: value };
    setDraftIntent(merged);
    pushMessage({ from: "user", type: "text", text: CAUSE_OPTIONS.find((o) => o.value === value)?.label || value });
    runMatching(merged);
  };

  const runMatching = async (intent) => {
    setStage("matching");
    pushMessage({ from: "bot", type: "loading", text: "Looking for the right people for you..." });

    try {
      const uid = auth.currentUser?.uid || userId;
      // Reuse the existing endpoint so auto_create_groups/communities picks this up unchanged.
      await fetch(`${BASE_URL}/api/survey/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: uid,
          problem: intent.problem,
          cause: intent.cause,
          description: intent.rawText,
          name: "Guest",
        }),
      });

      const [groupsRes, communitiesRes] = await Promise.all([
        fetchGroups().catch(() => ({ groups: [] })),
        fetchCommunities().catch(() => ({ communities: [] })),
      ]);
      const groups = groupsRes?.groups || [];
      const communities = communitiesRes?.communities || [];

      setMessages((prev) => prev.filter((m) => m.type !== "loading"));

      if (groups.length === 0 && communities.length === 0) {
        pushMessage({
          from: "bot", type: "text",
          text: "I couldn't find an exact match yet, but that's okay — I'll keep this in mind and let you know as soon as one opens up.",
        });
      } else {
        pushMessage({ from: "bot", type: "text", text: "Based on what you shared, here's who I found:" });
        pushMessage({ from: "bot", type: "matches", groups, communities });
      }
      setStage("done");
    } catch (err) {
      console.error("Matching failed:", err);
      setMessages((prev) => prev.filter((m) => m.type !== "loading"));
      pushMessage({ from: "bot", type: "text", text: "Something went wrong on my end — mind trying again in a moment?" });
      setStage("done");
    }
  };

  const handleJoinAttempt = (kind, item) => {
    if (auth.currentUser?.isAnonymous) {
      pushMessage({
        from: "bot", type: "verify-prompt",
        text: "Before you join, I just need to quickly verify it's really you — it keeps the space free of trolls and fake accounts. Takes about 10 seconds.",
        kind, item,
      });
      return;
    }
    completeJoin(kind, item);
  };

  const completeJoin = async (kind, item) => {
    try {
      if (kind === "group") await joinGroupFirestore(auth.currentUser.uid, item.id);
      else await joinCommunityFirestore(auth.currentUser.uid, item.id);
      pushMessage({ from: "bot", type: "text", text: `You're in — welcome to ${item.name}!` });
    } catch (err) {
      console.error("Join failed:", err);
      pushMessage({ from: "bot", type: "text", text: "That didn't go through — try again from Home in a moment." });
    }
  };

  const goToVerify = (mode, kind, item) => {
    navigate(mode === "signup" ? "/signup" : "/login", { state: { pendingJoin: { kind, item } } });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#222" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Typography variant="h6" sx={{ color: "#fff" }}>Dare To Dream</Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} onJoin={handleJoinAttempt} onVerify={goToVerify} />
        ))}
        <div ref={bottomRef} />
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type how you're feeling..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={stage === "matching"}
          sx={{ bgcolor: "#333", borderRadius: 2, "& .MuiInputBase-input": { color: "#fff" } }}
        />
        <IconButton onClick={handleSend} disabled={stage === "matching" || !input.trim()} sx={{ color: "#fff" }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

function MessageBubble({ message, onJoin, onVerify }) {
  if (message.type === "loading") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#aaa" }}>
        <CircularProgress size={16} sx={{ color: "#aaa" }} />
        <Typography variant="body2">{message.text}</Typography>
      </Box>
    );
  }

  if (message.type === "quick-replies") {
    return (
      <Box>
        <Bubble isBot text={message.text} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {message.options.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              onClick={() => message.onSelect(opt.value)}
              sx={{ bgcolor: "#444", color: "#fff", "&:hover": { bgcolor: "#555" } }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (message.type === "matches") {
    const items = [
      ...message.groups.map((g) => ({ ...g, kind: "group" })),
      ...message.communities.map((c) => ({ ...c, kind: "community" })),
    ];
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map((item) => (
          <Paper key={`${item.kind}-${item.id}`} sx={{ p: 1.5, bgcolor: "#333", color: "#fff", display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: item.kind === "group" ? "#2196f3" : "#9c27b0" }}>
              <GroupsIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">{item.name}</Typography>
              <Typography variant="caption" sx={{ color: "#aaa" }}>
                {item.kind === "group" ? "Group" : "Community"} · {item.members?.length || 0} members
              </Typography>
            </Box>
            <Button size="small" variant="contained" onClick={() => onJoin(item.kind, item)}>Join</Button>
          </Paper>
        ))}
      </Box>
    );
  }

  if (message.type === "verify-prompt") {
    return (
      <Box>
        <Bubble isBot text={message.text} />
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button size="small" variant="contained" onClick={() => onVerify("signup", message.kind, message.item)}>Sign Up</Button>
          <Button size="small" variant="outlined" sx={{ color: "#fff", borderColor: "#666" }} onClick={() => onVerify("login", message.kind, message.item)}>Log In</Button>
        </Box>
      </Box>
    );
  }

  return <Bubble isBot={message.from === "bot"} text={message.text} />;
}

function Bubble({ isBot, text }) {
  return (
    <Box sx={{ display: "flex", justifyContent: isBot ? "flex-start" : "flex-end" }}>
      <Paper sx={{
        p: "10px 14px", maxWidth: "75%",
        bgcolor: isBot ? "#333" : "#1976d2", color: "#fff",
        borderRadius: isBot ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
      }}>
        <Typography variant="body2">{text}</Typography>
      </Paper>
    </Box>
  );
}