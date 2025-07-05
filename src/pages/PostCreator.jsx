// src/pages/PostCreator.jsx
import React, { useState, useMemo } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress, // Added for loading indicator
  Snackbar,       // Added for feedback messages
  Alert,          // Added for Snackbar content
} from "@mui/material";
import { moderateContent } from "../api"; // Import the AI moderation API
import { useUser } from "../context/UserContext"; // Import useUser to get user info

export default function PostCreator({ onPost }) {
  const { userName, userDescription } = useUser(); // Get user info from context
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for AI moderation/post creation
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // Snackbar type ('success', 'error', etc.)

  // Detect type of post based on content
  const detectPostType = (text) => {
    const trimmed = text.trim();
    if (trimmed.endsWith("?")) return "question";
    if (
      trimmed.startsWith("//") ||
      trimmed.startsWith("#") ||
      trimmed.toLowerCase().includes("comment")
    )
      return "comment";
    if (trimmed.length > 0) return "statement";
    return "other";
  };

  const postType = useMemo(() => detectPostType(content), [content]);

  // Colors for post types
  const postTypeColors = {
    question: {
      color: "#ffffff",
      background: "rgba(255, 255, 200, 0.6)",
    },
    comment: {
      color: "#ffffff",
      background: "rgba(200, 200, 255, 0.6)",
    },
    statement: {
      color: "#ffffff",
      background: "rgba(200, 255, 200, 0.6)",
    },
    other: {
      color: "#ffffff",
      background: "rgba(150, 150, 150, 0.3)",
    },
  };

  // Backgrounds for text input container
  const typeBackgrounds = {
    question: "rgba(255, 255, 200, 0.3)",
    comment: "rgba(200, 200, 255, 0.3)",
    statement: "rgba(200, 255, 200, 0.3)",
    other: "rgba(150, 150, 150, 0.1)",
  };

  // Handle media file upload & preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    let type = "image"; // default fallback
  
    if (file.type.startsWith("video")) {
      type = "video";
    } else if (file.type.startsWith("image")) {
      type = "image";
    } else {
      // unsupported type fallback - use Snackbar instead of alert
      setSnackbarMessage("Unsupported media type. Please upload an image or video.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
  
    setMediaType(type);
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setMedia(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Handle form submit
  const handleSubmit = async (e) => { // Made async
    e.preventDefault();
    
    // Prevent empty post if no content and no media
    if (!content.trim() && !media) {
      setSnackbarMessage("Post content or media cannot be empty.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true); // Start loading
    setSnackbarOpen(false); // Close any existing snackbar

    try {
      // Step 1: Moderate the text content using the AI
      if (content.trim()) { // Only moderate if there's text content
        console.log("Sending content for moderation:", content.trim());
        const moderationResult = await moderateContent(content.trim());
        console.log("Moderation Result:", moderationResult);

        if (moderationResult && moderationResult.is_problematic) {
          // Content is problematic, prevent posting and show message
          setSnackbarMessage(
            `Your post was flagged: ${moderationResult.reason || "Content deemed inappropriate."} Category: ${moderationResult.category}`
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setLoading(false);
          return; // Stop the function here
        }
      }

      // Step 2: If content is safe (or no text content), proceed with creating the post
      const newPost = {
        id: Date.now().toString(),
        author: userName || "Anonymous", // Use user name from context
        description: userDescription || "No description provided.", // Use user description
        content: content.trim(),
        media: media,
        mediaType: mediaType,
        postType: detectPostType(content),
        createdAt: new Date().toISOString(),
        likes: 0, // Initialize likes
        comments: [], // Initialize comments
      };

      if (typeof onPost === "function") {
        onPost(newPost); // Call the onPost prop to add the new post to the feed
      }

      // Reset inputs
      setContent("");
      setMedia(null);
      setMediaType(null);
      setPreview(null);

      setSnackbarMessage("Post created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error("Error during post creation or moderation:", error);
      setSnackbarMessage(`Failed to create post: ${error.message || "An unknown error occurred."}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // End loading
    }
  };

  const currentColors = postTypeColors[postType] || postTypeColors.other;

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
        Create a Post
      </Typography>

      <Box
        sx={{
          backgroundColor: currentColors.background,
          color: currentColors.color,
          fontWeight: "600",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          maxWidth: "320px",
          mb: 2,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          userSelect: "none",
        }}
      >
        Detected post type: {postType}
      </Box>

      {/* Tips */}
      <Box
        sx={{
          background: "#222",
          padding: "0.4rem",
          borderRadius: "10px",
          mb: 2,
        }}
      >
      </Box>

      {/* Text input */}
      <Box
        sx={{
          backgroundColor: typeBackgrounds[postType],
          padding: "0.2rem",
          borderRadius: "10px",
          mb: 2,
        }}
      >
        <TextField
          label="What's on your mind?"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          sx={{ background: "transparent" }}
          inputProps={{
            style: { color: currentColors.color },
          }}
          InputLabelProps={{ style: { color: '#aaa' } }} // Label color
        />
        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "right", pr: 1, color: "#555" }}
        >
          Type: <strong>{postType}</strong>
        </Typography>
      </Box>

      {/* Media preview */}
      {preview && mediaType === "image" && (
        <img
          src={preview}
          alt="preview"
          style={{
            maxWidth: "50px",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        />
      )}
      {preview && mediaType === "video" && (
        <video
          controls
          style={{ width: "50%", marginBottom: "1rem", borderRadius: "8px" }}
        >
          <source src={preview} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* File upload */}
      <Box sx={{ mb: 2 }}>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          style={{ color: "#fff" }}
        />
      </Box>

      {/* Submit button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading} // Disable button when loading
        sx={{
          backgroundColor: "#2196f3", // Example color
          "&:hover": { backgroundColor: "#1976d2" },
          color: "#fff",
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Post"}
      </Button>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </form>
  );
}
