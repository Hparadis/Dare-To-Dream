// src/components/EmotionalSpectrumOverlay.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EmotionalSpectrumOverlay({ isOpen, onClose }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [emotionText, setEmotionText] = useState("");
  const [selectedEmotionKey, setSelectedEmotionKey] = useState(null); // Key of the detected emotion
  const [feedback, setFeedback] = useState("");

  const emotions = [
    { name: "Happy", color: "#FFEB3B", key: "happy", keywords: ["happy", "joy", "good", "great", "excited", "love", "fun", "amazing", "wonderful"] },
    { name: "Calm", color: "#8BC34A", key: "calm", keywords: ["calm", "peace", "relaxed", "tranquil", "serene", "chill"] },
    { name: "Sad", color: "#2196F3", key: "sad", keywords: ["sad", "unhappy", "down", "gloomy", "depressed", "blue", "upset"] },
    { name: "Angry", color: "#F44336", key: "angry", keywords: ["angry", "mad", "frustrated", "annoyed", "rage", "irritated"] },
    { name: "Excited", color: "#FF9800", key: "excited", keywords: ["excited", "thrilled", "eager", "bubbly", "pumped"] },
    { name: "Neutral", color: "#B0BEC5", key: "neutral", keywords: ["okay", "fine", "normal", "meh"] },
  ];

  // Effect to detect emotion and provide feedback based on text input
  useEffect(() => {
    if (!emotionText.trim()) {
      setSelectedEmotionKey(null);
      setFeedback("");
      return;
    }

    const lowerCaseText = emotionText.toLowerCase();
    let detectedEmotion = null;

    for (const emotion of emotions) {
      if (emotion.keywords.some(keyword => lowerCaseText.includes(keyword))) {
        detectedEmotion = emotion;
        break;
      }
    }

    setSelectedEmotionKey(detectedEmotion ? detectedEmotion.key : null);

    if (detectedEmotion) {
      if (["happy", "calm", "excited"].includes(detectedEmotion.key)) {
        setFeedback(`Great! You earned +10 points for feeling ${detectedEmotion.name.toLowerCase()}! Keep up the good vibes!`);
      } else if (["sad", "angry"].includes(detectedEmotion.key)) {
        setFeedback(`It's okay to feel ${detectedEmotion.name.toLowerCase()}. Here's a tip: Try deep breathing for 5 minutes, or talk to a trusted friend. You've got this!`);
      } else { // Neutral
        setFeedback("You're feeling neutral. Reflect on what could make your day better!");
      }
    } else {
      setFeedback("Couldn't identify emotion. Maybe try being more descriptive, or choose manually!");
    }

  }, [emotionText]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(25,25,25,0.9)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.37)",
          position: 'relative',
          overflow: 'hidden',
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'center',
          justifyContent: 'center',
        },
        '& .MuiDialog-paper': {
            width: isSmallScreen ? '95%' : '80%',
            maxHeight: '90%',
            overflowY: 'auto'
        }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: theme.spacing(1),
          left: theme.spacing(1),
          color: '#fff',
          zIndex: 1,
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <DialogTitle sx={{ textAlign: "center", color: "#fff", pt: 4, pb: 2 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          Emotional Spectrum
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <TextField
          label="What made you feel this way?"
          multiline
          rows={3}
          fullWidth
          value={emotionText}
          onChange={(e) => setEmotionText(e.target.value)}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' }, '&.Mui-focused fieldset': { borderColor: '#fff' } },
            '& .MuiInputLabel-root': { color: '#bbb' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
            '& .MuiInputBase-input::placeholder': { color: '#888' },
          }}
        />

        {/* Emotional Spectrum Circle - Represented by a flexbox/grid layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(3, 1fr)' }, // Adjusted for more compact circle
            gap: { xs: 1.5, sm: 2 },
            justifyContent: 'center',
            alignItems: 'center',
            p: { xs: 1, sm: 2 },
            background: "rgba(255,255,255,0.05)",
            borderRadius: '50%', // Makes the container itself circular
            width: isSmallScreen ? 250 : 350, // Fixed width for overall circle size
            height: isSmallScreen ? 250 : 350, // Fixed height to maintain aspect ratio
            mx: 'auto',
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.4)',
            flexShrink: 0, // Prevent shrinking on smaller screens
            position: 'relative', // For absolute positioning of inner elements
            overflow: 'hidden', // To contain the pseudo-circle effect
          }}
        >
            {emotions.map((emotion) => (
                <Box
                    key={emotion.key}
                    onClick={() => setSelectedEmotionKey(emotion.key)} // Allow manual selection
                    sx={{
                        backgroundColor: emotion.color,
                        borderRadius: '50%',
                        width: isSmallScreen ? 70 : 90, // Size of each emotion "blob"
                        height: isSmallScreen ? 70 : 90,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.palette.getContrastText(emotion.color), // Auto-adjust text color for contrast
                        fontWeight: 'bold',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
                        transform: selectedEmotionKey === emotion.key ? 'scale(1.15)' : 'scale(1)',
                        opacity: selectedEmotionKey && selectedEmotionKey !== emotion.key ? 0.6 : 1,
                        boxShadow: selectedEmotionKey === emotion.key ? `0 0 0 4px ${theme.palette.secondary.main}` : 'none',
                        '&:hover': {
                            transform: 'scale(1.08)',
                            boxShadow: `0 0 0 2px ${theme.palette.secondary.main}`,
                        },
                        fontSize: isSmallScreen ? '0.7rem' : '0.85rem',
                        textShadow: '0 0 3px rgba(0,0,0,0.6)',
                        zIndex: selectedEmotionKey === emotion.key ? 2 : 1, // Bring selected to front
                    }}
                >
                    {emotion.name}
                </Box>
            ))}
            {/* Optional central element for the "circle" effect */}
            <Box
                sx={{
                    position: 'absolute',
                    width: isSmallScreen ? 60 : 80,
                    height: isSmallScreen ? 60 : 80,
                    borderRadius: '50%',
                    bgcolor: 'rgba(50,50,50,0.8)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    zIndex: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant={isSmallScreen ? "caption" : "body2"} sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                    Your Mood
                </Typography>
            </Box>
        </Box>


        {feedback && (
          <Paper
            sx={{
              width: '100%',
              p: 2,
              mt: 2,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 2,
              color: "#fff",
              textAlign: 'center',
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "none",
            }}
          >
            <Typography variant="body1">{feedback}</Typography>
          </Paper>
        )}
      </DialogContent>
    </Dialog>
  );
}