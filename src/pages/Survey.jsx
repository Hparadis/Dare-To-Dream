import React, { useState , useEffect1} from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; 
import { getAuth } from "firebase/auth";
import { getApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; 


const Survey = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [goDeeperForStep, setGoDeeperForStep] = useState(null);
  const [previousStep, setPreviousStep] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    problem: "",
    cause: "",
    timePeriod: "",
    effect: "",
    description: "",
    coping: "",
    support: "",
    deeperProblem: "",
    deeperCause: "",
  });
  

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handlePrevious = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore(getApp());
  
      if (!user) {
        throw new Error("User not authenticated");
      }
  
      const token = await user.getIdToken(); // Optional: if using auth protection
      const userId = user.uid;

      await setDoc(doc(db, "Surveys", user.uid), {
        userId: user.uid,
        name: formData.name || `User-${user.uid.slice(0, 4)}`,
        description: formData.description || "New user",
        createdAt: new Date().toISOString(),
        ...formData
      });
  
      const response = await fetch("http://localhost:8000/api/survey/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optional if you're securing routes later:
          // "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, userId }),
      });
      // After fetching the current user ID and before sending the POST
      
      const result = await response.json();
      console.log("Submitted:", result);
      navigate("/home");
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };
    
  const { userName } = useUser();
  const getStepTitle = (step) => {
    const displayName = userName || "there";
    const titles = [
      `Hi ${displayName}, what's troubling you?`,
      "Where do you think it started?",
      "How long has this been affecting you?",
      "Tell us how it’s impacting your life.",
      "Share your name and a little about you.",
      "Let’s dive deeper and understand more..."
    ];
    return titles[step] || "Tell us about yourself";
  };

  const renderGoDeeper = () => {
    const labels = {
      0: "What are your coping mechanisms or support systems?",
      1: "Can you describe how the cause has changed over time?",
      2: "Did the time period make things worse or better?",
      3: "Do these effects show in your relationships or work?",
    };
    return (
      <>
        <Grid item sx={{ width: "100%" }}>
          <Typography sx={{ mb: 2 }}>{labels[goDeeperForStep]}</Typography>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            minRows={3}
            name={`goDeeper_${goDeeperForStep}`}
            value={formData[`goDeeper_${goDeeperForStep}`] || ""}
            onChange={handleChange}
            InputProps={{ sx: { color: "#fff" } }}
            InputLabelProps={{ sx: { color: "#fff" } }}
          />
        </Grid>
        <Grid item sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button variant="outlined" onClick={() => setGoDeeperForStep(null)}>Back</Button>
          <Button
            variant="contained"
            onClick={() => {
              setStep(previousStep + 1);
              setGoDeeperForStep(null);
              setPreviousStep(null);
            }}
          >
            Next
          </Button>
        </Grid>
      </>
    );
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          width: "100%",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.3)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontFamily: "Poppins, Segoe UI" }}>
          {getStepTitle(step, formData.name)}
        </Typography>
  
        {error && <Typography role="alert" color="error" sx={{ mb: 2 }}>{error}</Typography>}
  
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={2} direction="column" alignItems="center">
            {goDeeperForStep !== null ? (
              renderGoDeeper()
            ) : (
              <>
                {step === 0 && (
                  <Grid item sx={{ width: "100%" }}>
                    <FormControl fullWidth>
                      <InputLabel id="problem-label" sx={{ color: "#fff" }}>Problem</InputLabel>
                      <Select
                        labelId="problem-label"
                        label="Problem"
                        name="problem"
                        value={formData.problem}
                        onChange={handleChange}
                        sx={{
                          color: "#fff",
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                        }} 
                      >
                        <MenuItem value="addiction">Addiction</MenuItem>
                        <MenuItem value="depression">Depression</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
  
                {step === 1 && (
                  <Grid item sx={{ width: "100%" }}>
                    <FormControl fullWidth>
                      <InputLabel id="cause-label" sx={{ color: "#fff" }}>Cause</InputLabel>
                      <Select
                        labelId="cause-label"
                        label="Cause"
                        name="cause"
                        value={formData.cause}
                        onChange={handleChange}
                        sx={{
                          color: "#fff",
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                        }}
                      >
                        <MenuItem value="family">Family</MenuItem>
                        <MenuItem value="relationship">Relationship</MenuItem>
                        <MenuItem value="society">Society</MenuItem>
                        <MenuItem value="self-inflicted">Self-inflicted</MenuItem>
                        <MenuItem value="others">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
  
                {step === 2 && (
                  <Grid item sx={{ width: "100%" }}>
                    <TextField
                      name="timePeriod"
                      label="Time Period"
                      fullWidth
                      value={formData.timePeriod}
                      onChange={handleChange}
                      placeholder="How long has it affected you?"
                      InputProps={{ sx: { color: "#fff" } }}
                      InputLabelProps={{ sx: { color: "#fff" } }}
                    />
                  </Grid>
                )}
  
                {step === 3 && (
                  <Grid item sx={{ width: "100%" }}>
                    <TextField
                      name="effect"
                      label="Effect"
                      fullWidth
                      value={formData.effect}
                      onChange={handleChange}
                      placeholder="Describe the effect on you"
                      InputProps={{ sx: { color: "#fff" } }}
                      InputLabelProps={{ sx: { color: "#fff" } }}
                    />
                  </Grid>
                )}
  
                {step === 4 && (
                  <Grid item sx={{ width: "100%" }}>
                    <Tooltip title="If you're ready for others to see you" arrow>
                      <TextField
                        name="name"
                        label="Name"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        InputProps={{ sx: { color: "#fff" } }}
                        InputLabelProps={{ sx: { color: "#fff" } }}
                        sx={{ mt: 2 }}
                      />
                    </Tooltip>
                    <TextField
                      name="description"
                      label="Description"
                      fullWidth
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Share your hobbies, interests..."
                      InputProps={{ sx: { color: "#fff" } }}
                      InputLabelProps={{ sx: { color: "#fff" } }}
                      sx={{ mt: 2 }}
                    />
  
                    <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Tooltip title="You’ll have a safe but limited experience" arrow>
                      <IconButton
                        onClick={() => {
                          setFormData({
                            ...formData,
                            name: "Guest",
                            description: "Guest user",
                          });
                          navigate("/home");
                        }}
                        sx={{
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "transparent", // prevent background ripple
                          },
                        }}
                      >
                        <PersonOutlineIcon
                          fontSize="large"
                          sx={{
                            border: "2px solid #333",
                            borderRadius: "50%",
                            padding: 2,
                            transition: "0.3s",
                            "&:hover": {
                              backgroundColor: "#333",
                              color: "#fff",
                            },
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="caption" sx={{ mt: 1, color: "#fff" }}>
                      Surf as Guest
                    </Typography>
                  </Box>

                  </Grid>
                )}
              </>
            )}
  
            {goDeeperForStep === null && step >= 0 && step <= 3 && (
              <Button
                variant="text"
                onClick={() => {
                  setPreviousStep(step);
                  setGoDeeperForStep(step);
                }}
              >
                Go Deeper
              </Button>
            )}
  
            {goDeeperForStep === null && (
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
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      if (!formData.name || !formData.description) {
                        setError("Please enter your name and description or choose Guest mode.");
                        return;
                      }
                      handleSubmit(e);
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                  </Button>

                )}
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );  
};

export default Survey;
