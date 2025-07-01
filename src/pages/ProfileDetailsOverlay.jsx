// src/components/ProfileDetailsOverlay.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  CircularProgress,
  useMediaQuery,
  useTheme,
  MenuItem, // For Select/Dropdown
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from '@mui/icons-material/Save';

export default function ProfileDetailsOverlay({ isOpen, onClose }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    gender: "",
    zodiacSign: "",
    beliefs: "",
    fears: "",
    phobias: "",
    embarrassingMoments: "",
    happyMoments: "",
    favoriteThings: "",
    // Add more fields as needed
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    // Simulate API call to save data
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network request
      console.log("Saving Profile Details:", formData);
      alert("Profile details saved successfully!");
      onClose(); // Close overlay on success
    } catch (error) {
      alert("Error saving profile details.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const textInputProps = {
    sx: {
      '& .MuiOutlinedInput-root': {
        color: '#fff',
        '& fieldset': { borderColor: '#555' },
        '&:hover fieldset': { borderColor: '#888' },
        '&.Mui-focused fieldset': { borderColor: '#fff' },
      },
      '& .MuiInputLabel-root': { color: '#bbb' },
      '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
      '& .MuiInputBase-input::placeholder': { color: '#888' },
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
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
          Add Your Story
        </Typography>
        <Typography variant="subtitle2" sx={{ color: '#bbb' }}>
            Share more about yourself to connect deeper.
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    fullWidth
                    {...textInputProps}
                >
                    <MenuItem value=""><em>Select Gender</em></MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Non-binary">Non-binary</MenuItem>
                    <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    select
                    label="Zodiac Sign"
                    name="zodiacSign"
                    value={formData.zodiacSign}
                    onChange={handleChange}
                    fullWidth
                    {...textInputProps}
                >
                    <MenuItem value=""><em>Select Sign</em></MenuItem>
                    <MenuItem value="Aries">Aries</MenuItem>
                    <MenuItem value="Taurus">Taurus</MenuItem>
                    <MenuItem value="Gemini">Gemini</MenuItem>
                    <MenuItem value="Cancer">Cancer</MenuItem>
                    <MenuItem value="Leo">Leo</MenuItem>
                    <MenuItem value="Virgo">Virgo</MenuItem>
                    <MenuItem value="Libra">Libra</MenuItem>
                    <MenuItem value="Scorpio">Scorpio</MenuItem>
                    <MenuItem value="Sagittarius">Sagittarius</MenuItem>
                    <MenuItem value="Capricorn">Capricorn</MenuItem>
                    <MenuItem value="Aquarius">Aquarius</MenuItem>
                    <MenuItem value="Pisces">Pisces</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Beliefs"
                    name="beliefs"
                    value={formData.beliefs}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="What core beliefs guide you?"
                    {...textInputProps}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Fears"
                    name="fears"
                    value={formData.fears}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="What are some of your fears?"
                    {...textInputProps}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Phobias"
                    name="phobias"
                    value={formData.phobias}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Do you have any specific phobias?"
                    {...textInputProps}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Embarrassing Moments"
                    name="embarrassingMoments"
                    value={formData.embarrassingMoments}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Share a funny or embarrassing moment."
                    {...textInputProps}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Happy Moments"
                    name="happyMoments"
                    value={formData.happyMoments}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="What are some of your happiest memories?"
                    {...textInputProps}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Favorite Things"
                    name="favoriteThings"
                    value={formData.favoriteThings}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="List some of your favorite things (hobbies, foods, music, etc.)."
                    {...textInputProps}
                />
            </Grid>
        </Grid>


        <Button
          variant="contained"
          startIcon={isSaving ? null : <SaveIcon />}
          onClick={handleSubmit}
          disabled={isSaving}
          sx={{
            mt: 3,
            bgcolor: '#6200EE',
            color: '#fff',
            '&:hover': { bgcolor: '#7F39FB' },
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 'bold',
          }}
        >
          {isSaving ? <CircularProgress size={24} color="inherit" /> : "Save Details"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}