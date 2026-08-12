// src/components/QuickChatDialog.jsx
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, Box, Paper, Typography, TextField, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { getChatMessages, sendMessage, conversationIdFor } from "../api";
import { BRAND_COLOR, BRAND_COLOR_TEXT_ON } from "../theme/brand";

export default function QuickChatDialog({ open, onClose, userId, otherUserId, otherLabel = "them" }) {
  const [messages, setMessages] = useState([]);
  const [localNotices, setLocalNotices] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const conversationId = userId && otherUserId ? conversationIdFor(userId, otherUserId) : null;

  useEffect(() => {
    if (!open || !conversationId) return;
    let active = true;
    setMessages([]);
    setLocalNotices([]);

    const fetchMessages = async () => {
      try {
        const history = await getChatMessages(userId, otherUserId);
        if (active) setMessages(history || []);
      } catch (err) {
        console.error("Failed to load quick chat:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2500);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [open, conversationId, userId, otherUserId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setLoading(true);
    const payload = { senderId: userId, receiverId: otherUserId, content: text, timestamp: new Date().toISOString() };
    try {
      const data = await sendMessage(conversationId, payload);
      if (data?.flagged) {
        setLocalNotices((prev) => [
          ...prev,
          { id: `notice-${Date.now()}`, text: data.resources?.message, hotlines: data.resources?.hotlines },
        ]);
      } else {
        setMessages((prev) => [...prev, payload]);
      }
    } catch (err) {
      console.error("Quick chat send failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { background: "#242424", color: "#fff", borderRadius: 3 } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700 }}>
        Chat with {otherLabel}
        <IconButton onClick={onClose} sx={{ color: "#aaa" }} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1, minHeight: 320 }}>
        <Box sx={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
        {messages.map((m, i) => (
            <Paper
              key={i}
              sx={{
                alignSelf: m.senderId === userId ? "flex-end" : "flex-start",
                maxWidth: "80%",
                p: 1.2,
                borderRadius: m.senderId === userId ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: m.senderId === userId ? BRAND_COLOR : "rgba(255,255,255,0.08)",
                color: m.senderId === userId ? BRAND_COLOR_TEXT_ON : "#fff",
              }}
            >
              <Typography variant="body2">{m.content}</Typography>
            </Paper>
          ))}
          {localNotices.map((n) => (
            <Paper
              key={n.id}
              sx={{
                alignSelf: "center",
                maxWidth: "95%",
                p: 1.5,
                borderRadius: 3,
                background: "rgba(224,92,92,0.1)",
                border: "1.5px solid #e05c5c",
              }}
            >
              <Typography variant="body2" sx={{ color: "#fff", mb: n.hotlines?.length ? 1 : 0 }}>
                {n.text}
              </Typography>
              {n.hotlines?.map((h) => (
                <Typography key={h.name} variant="caption" sx={{ display: "block", color: "#ccc" }}>
                  {h.name} — {h.contact}
                </Typography>
              ))}
            </Paper>
          ))}
            {/* ) : (
              <Paper
                key={i}
                sx={{
                  alignSelf: m.senderId === userId ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  p: 1.2,
                  borderRadius: m.senderId === userId ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.senderId === userId ? BRAND_COLOR : "rgba(255,255,255,0.08)",
                  color: m.senderId === userId ? BRAND_COLOR_TEXT_ON : "#fff",
                }}
              >
                <Typography variant="body2">{m.content}</Typography>
              </Paper>
            )
          )} */}
          <div ref={endRef} />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                background: "rgba(255,255,255,0.05)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.25)" },
              },
            }}
          />
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
            {loading ? <CircularProgress size={18} sx={{ color: BRAND_COLOR_TEXT_ON }} /> : <SendIcon fontSize="small" />}
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
