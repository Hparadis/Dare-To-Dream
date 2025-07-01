// LoginPage.jsx
import React, { useState,useEffect } from "react";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import CustomTextField from "./CustomTextField"; // Reuse our custom input from previous example
import tracker from "../tracker"; 
export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Validate that all required fields are filled
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError("Please fill out all required fields.");
      } else {
        setError("");
        console.log("Form submitted", formData);
        // After successful submission, navigate to the Survey page
        navigate("/Home");
      }
    }, 1500);
  };
  useEffect(() => {
    tracker.trackEvent("page_view", { page: "Login" });
  }, []);
  const handleLogin = (isSuccess) => {
    // Track the login event with success status
    tracker.trackEvent("user_login", { success: isSuccess });
    // Add your login logic here...
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          width: { xs: "90%", sm: "80%", md: "60%" },
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.3)"
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontFamily: "Poppins, Segoe UI" }}
        >
          Login
        </Typography>
        {error && (
          <Typography role="alert" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} direction="column">
            {/* Email Field */}
            <Grid item xs={12}>
              <CustomTextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                // Pass touched if you want to make the field dynamic.
                touched={formData.email !== ""}
              />
            </Grid>
            {/* Password Field */}
            <Grid item xs={12}>
              <CustomTextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                inputProps={{ minLength: 6 }}
                touched={formData.password !== ""}
              />
            </Grid>
            {/* Remember Me Checkbox */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{ color: "#fff" }}
                  />
                }
                label={<Typography sx={{ color: "#fff" }}>Remember Me</Typography>}
              />
            </Grid>
            {/* Login Button */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 1,
                  py: 1,
                  width: "50%",
                  backgroundColor: "#ff6f61",
                  color: "#fff",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#ff4f41" }
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
        <Divider sx={{ my: 3, color: "#fff" }}>----- OR -----</Divider>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={() => alert("Google Login Placeholder")}
            sx={{
              width: "50%",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              color: "#fff",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" }
            }}
          >
            Login with Google
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
}
