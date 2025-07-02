// src/pages/Survey.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  FormControl,
  CircularProgress,
  Box, // <--- ADDED THIS IMPORT
} from "@mui/material";
import tracker from "../tracker";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useUser } from "../context/UserContext";
import { submitSurvey } from "../api";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Fab, ToggleButton, ToggleButtonGroup } from "@mui/material";


const Survey = () => {
  // Ensure setProfileImage is removed if you're not using it, or kept if you want to set a default.
  // For now, assuming we're not setting a profile image from the survey.
  const { setUserName, setUserDescription } = useUser(); // <--- Corrected destructuring based on UserContext update
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [formData, setFormData] = useState({
    problem: "",
    cause: "",
    timePeriod: "",
    effect: "",
    name: "",
    description: "",
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState("chat"); 


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    setUserName("Hirwa");
    e.preventDefault();
    setLoading(true);
  
    try {
      let userId = localStorage.getItem("userId");
      if (!userId) {
        // If userId is missing, generate a new one. This should ideally be done once at app start.
        userId = `user_${Date.now()}`;
        localStorage.setItem("userId", userId);
        console.warn(`Generated new userId: ${userId}`);
      }
      
      const payload = { ...formData, userId }; // Ensure userId is included

      const result = await submitSurvey(payload);
  
      if (result.status === "success") {
        // Update user context with name and description
        setUserName(formData.name); // <--- This should now be a function
        setUserDescription(formData.description); // <--- This should now be a function
        navigate("/home");
      } else {
        console.error("Submission failed:", result.message);
        setApiResponse({ status: "error", message: result.message });
      }
    } catch (error) {
      console.error("Submission error:", error.message);
      setApiResponse({ status: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    tracker.trackEvent("page_view", { page: "Survey" });
    // Ensure userId is set on component mount if not already present
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = `user_${Date.now()}`;
      localStorage.setItem("userId", userId);
    }
    setFormData((prev) => ({ ...prev, userId }));
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Fab
  color="primary"
  onClick={() => setChatOpen(!chatOpen)}
  sx={{
    position: "fixed",
    bottom: 20,
    right: 20,
    backgroundColor: "#90caf9",
    "&:hover": { backgroundColor: "#64b5f6" },
  }}
>
  <ChatBubbleOutlineIcon />
</Fab>

      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          width: { xs: "90%", sm: "80%", md: "60%" },
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.3)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontFamily: "Poppins, Segoe UI" }}>
          Let us know you a bit
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column" alignItems="center">
            {step === 0 && (
              <Grid item sx={{ width: "100%" }}>
                <FormControl fullWidth variant="outlined">
                <InputLabel id="problem-label" sx={{ color: "#fff" }}>Problem</InputLabel>
                <Select
                  labelId="problem-label"
                  id="problem"
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  label="Problem"
                  sx={{
                    color: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                  }}
                >
                  <MenuItem value="addiction">Addiction</MenuItem>
                  <MenuItem value="depression">Depression</MenuItem>
                  <MenuItem value="anxiety">Anxiety</MenuItem>
                  <MenuItem value="ptsd">PTSD</MenuItem>
                  <MenuItem value="bipolar">Bipolar Disorder</MenuItem>
                </Select>
              </FormControl>

              </Grid>
            )}

            {step === 1 && (
              <Grid item sx={{ width: "100%" }}>
                <FormControl fullWidth variant="outlined">
              <InputLabel id="cause-label" sx={{ color: "#fff" }}>Cause</InputLabel>
              <Select
                labelId="cause-label"
                id="cause"
                name="cause"
                value={formData.cause}
                onChange={handleChange}
                label="Cause"
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                }}
              >
                <MenuItem value="family">Family</MenuItem>
                <MenuItem value="relationship">Relationship</MenuItem>
                <MenuItem value="society">Society</MenuItem>
                <MenuItem value="self-inflicted">Self-inflicted</MenuItem>
                <MenuItem value="others">Others</MenuItem>
              </Select>
            </FormControl>

              </Grid>
            )}

            {step === 2 && (
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  variant="outlined"
                  label="Time Period"
                  name="timePeriod"
                  value={formData.timePeriod}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="How long has it affected you?"
                  InputProps={{ sx: { color: "#fff" } }}
                  InputLabelProps={{ sx: { color: "#fff" } }}
                  sx={{ backgroundColor: "transparent", borderRadius: "8px" }}
                />
              </Grid>
            )}

            {step === 3 && (
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  variant="outlined"
                  label="Effect"
                  name="effect"
                  value={formData.effect}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="Describe the effect on you"
                  InputProps={{ sx: { color: "#fff" } }}
                  InputLabelProps={{ sx: { color: "#fff" } }}
                  sx={{ backgroundColor: "transparent", borderRadius: "8px" }}
                />
              </Grid>
            )}

          {step === 4 && (
            <Grid item sx={{ width: "100%", textAlign: "center" }}>
              <TextField
                variant="outlined"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Enter your name"
                InputProps={{ sx: { color: "#fff" } }}
                InputLabelProps={{ sx: { color: "#fff" } }}
                sx={{ mt: 2, backgroundColor: "transparent", borderRadius: "8px" }}
              />
              <TextField
                variant="outlined"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Describe yourself"
                InputProps={{ sx: { color: "#fff" } }}
                InputLabelProps={{ sx: { color: "#fff" } }}
                sx={{ mt: 2, backgroundColor: "transparent", borderRadius: "8px" }}
              />

              {/* Anonymous guest button */}
              <IconButton
                onClick={() => {
                  // handle guest surfing logic here, e.g.
                  // setGuest(true);
                  // or any other action
                }}
                sx={{
                  mt: 3,
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  margin: "auto",
                }}
                aria-label="Surf as guest"
              >
                <PersonOutlineIcon fontSize="large" />
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  Surf as Guest
                </Typography>
              </IconButton>
            </Grid>
          )}

            <Grid item sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              {step > 0 && (
                <Button variant="outlined" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              {step < 4 ? (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="contained">
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {apiResponse && (
          <Box sx={{ mt: 3, textAlign: "left" }}>
            <Typography variant="h6">Grouping Results:</Typography>
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </Box>
        )}
        {chatOpen && (
  <Box
    sx={{
      position: "fixed",
      bottom: 80,
      right: 20,
      width: 300,
      p: 2,
      bgcolor: "rgba(255,255,255,0.95)",
      borderRadius: 3,
      boxShadow: 5,
      zIndex: 1300,
      fontFamily: "Poppins, Segoe UI",
    }}
  >
    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
      Survey AI: The Gentle Guide
    </Typography>
    <Typography variant="body2" sx={{ fontStyle: "italic", color: "#555", mb: 1 }}>
      “You’re not being judged. Just share what you feel. We’re here to help.”
    </Typography>
    <Typography variant="body2" sx={{ color: "#777", mb: 1 }}>
      “There’s no wrong answer. This is your story.”
    </Typography>

    <ToggleButtonGroup
      value={chatMode}
      exclusive
      onChange={(_, val) => val && setChatMode(val)}
      sx={{ mb: 1 }}
    >
      <ToggleButton value="chat">Guided Chat</ToggleButton>
      <ToggleButton value="form">Quick Form</ToggleButton>
    </ToggleButtonGroup>

    {chatMode === "chat" ? (
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2">🤖 Ask away! What’s been troubling you lately?</Typography>
        {/* Placeholder for actual chat interface */}
        <TextField
          placeholder="Type here..."
          fullWidth
          size="small"
          sx={{ mt: 1 }}
        />
      </Box>
    ) : (
      <Typography variant="body2" sx={{ mt: 1 }}>
        You're using the quick form on the main screen.
      </Typography>
    )}
  </Box>
)}

      </Paper>
    </Container>
  );
};

export default Survey;
