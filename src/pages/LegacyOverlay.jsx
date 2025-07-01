// src/components/LegacyOverlay.jsx
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VideocamIcon from '@mui/icons-material/Videocam';
import BookIcon from '@mui/icons-material/Book';
import DescriptionIcon from '@mui/icons-material/Description';
import TextFieldsIcon from '@mui/icons-material/TextFields'; // For "other text"

export default function LegacyOverlay({ isOpen, onClose }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedType, setSelectedType] = useState("");
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setFile(null); // Reset file when type changes
    setTextInput(""); // Reset text input
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Basic "long or short" detection example:
      // For actual video/audio duration, you'd need a more robust library
      // or server-side processing. Here, we'll use file size as a simple indicator.
      if (uploadedFile.type.startsWith("video/") || uploadedFile.type.startsWith("audio/")) {
        console.log("Media file size:", (uploadedFile.size / (1024 * 1024)).toFixed(2), "MB");
        if (uploadedFile.size > 50 * 1024 * 1024) { // Example: >50MB is "long"
          console.log("Detected as a potentially long media file.");
        } else {
          console.log("Detected as a potentially short media file.");
        }
      } else if (uploadedFile.type.startsWith("text/") || uploadedFile.type.includes("doc") || uploadedFile.type.includes("pdf")) {
        console.log("Document/Text file size:", (uploadedFile.size / 1024).toFixed(2), "KB");
        if (uploadedFile.size > 500 * 1024) { // Example: >500KB is "long"
          console.log("Detected as a potentially long document.");
        } else {
          console.log("Detected as a potentially short document.");
        }
      } else {
        console.log("Other file type detected. Size:", (uploadedFile.size / 1024).toFixed(2), "KB");
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (action) => {
    if (!selectedType) {
      alert("Please select a content type.");
      return;
    }
    if ((selectedType === "video" || selectedType === "memoire" || selectedType === "book") && !file) {
      alert("Please upload a file.");
      return;
    }
    if (selectedType === "otherText" && !textInput.trim()) {
      alert("Please enter some text.");
      return;
    }

    setIsUploading(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`${action}ing Legacy:`, {
        type: selectedType,
        file: file ? file.name : null,
        text: textInput,
      });
      alert(`Legacy item ${action}ed successfully!`);
      onClose(); // Close overlay on success
    } catch (error) {
      alert(`Error ${action}ing legacy item.`);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(25,25,25,0.9)", // Darker background for overlay
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
          alignItems: 'center', // Center vertically
          justifyContent: 'center', // Center horizontally
        },
        // Responsive dialog size
        '& .MuiDialog-paper': {
            width: isSmallScreen ? '95%' : '70%',
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
          Create Legacy
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' }, '&.Mui-focused fieldset': { borderColor: '#fff' } }, '& .MuiInputLabel-root': { color: '#bbb' }, '& .MuiInputLabel-root.Mui-focused': { color: '#fff' } }}>
          <InputLabel id="legacy-type-select-label">Select Content Type</InputLabel>
          <Select
            labelId="legacy-type-select-label"
            id="legacy-type-select"
            value={selectedType}
            label="Select Content Type"
            onChange={handleTypeChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="video">
              <VideocamIcon sx={{ mr: 1 }} /> Video
            </MenuItem>
            <MenuItem value="memoire">
              <DescriptionIcon sx={{ mr: 1 }} /> Memoire
            </MenuItem>
            <MenuItem value="book">
              <BookIcon sx={{ mr: 1 }} /> Book
            </MenuItem>
            <MenuItem value="otherText">
              <TextFieldsIcon sx={{ mr: 1 }} /> Other Text
            </MenuItem>
          </Select>
        </FormControl>

        {(selectedType === "video" || selectedType === "memoire" || selectedType === "book") && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept={selectedType === "video" ? "video/*,audio/*" : selectedType === "memoire" || selectedType === "book" ? ".pdf,.doc,.docx,.txt" : "*/*"}
            />
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={handleUploadClick}
              sx={{
                bgcolor: '#03DAC6',
                color: '#1a1a1a',
                '&:hover': { bgcolor: '#05B39E' },
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              {file ? `File Selected: ${file.name}` : "Upload File"}
            </Button>
            {file && (
              <Typography variant="body2" sx={{ color: '#aaa' }}>
                File Size: {(file.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            )}
          </Box>
        )}

        {selectedType === "otherText" && (
          <TextField
            label="Enter your text here"
            multiline
            rows={4}
            fullWidth
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            variant="outlined"
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' }, '&.Mui-focused fieldset': { borderColor: '#fff' } },
              '& .MuiInputLabel-root': { color: '#bbb' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
              '& .MuiInputBase-input::placeholder': { color: '#888' },
            }}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => handleSubmit("Keep")}
            disabled={isUploading || (!selectedType || ((selectedType === "video" || selectedType === "memoire" || selectedType === "book") && !file) || (selectedType === "otherText" && !textInput.trim()))}
            sx={{
              flex: 1,
              borderColor: '#6200EE',
              color: '#6200EE',
              '&:hover': { borderColor: '#7F39FB', bgcolor: 'rgba(98, 0, 238, 0.1)' },
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
            }}
          >
            {isUploading ? <CircularProgress size={24} color="inherit" /> : "Keep"}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit("Publish")}
            disabled={isUploading || (!selectedType || ((selectedType === "video" || selectedType === "memoire" || selectedType === "book") && !file) || (selectedType === "otherText" && !textInput.trim()))}
            sx={{
              flex: 1,
              bgcolor: '#6200EE',
              color: '#fff',
              '&:hover': { bgcolor: '#7F39FB' },
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
            }}
          >
            {isUploading ? <CircularProgress size={24} color="inherit" /> : "Publish"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}