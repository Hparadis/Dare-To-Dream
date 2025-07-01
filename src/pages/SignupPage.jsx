import React, { useState,useEffect } from "react";
import { Container, Paper, Grid, Typography, Button, Divider, CircularProgress } from "@mui/material";
import CustomTextField from "./CustomTextField";
import tracker from "../tracker";
export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        navigate("/survey");
      }
    }, 1500);
  };
  useEffect(() => {
    // Track when this page is viewed
    tracker.trackEvent("page_view", { page: "Signup" });
  }, []);
  const handleLogin = (isSuccess) => {
    // Track the login event with success status
    tracker.trackEvent("user_login", { success: isSuccess });
    // Add your login logic here...
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
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
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        {error && <Typography role="alert" color="error">{error}</Typography>}
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <CustomTextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                autoComplete="given-name"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="new-password"
                inputProps={{ minLength: 6 }}
              />
            </Grid>
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
                  "&:hover": { backgroundColor: "#ff4f41" },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
        <Divider sx={{ my: 3, color: "#fff" }}>----- OR -----</Divider>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={() => alert("Google Signup Placeholder")}
            sx={{
              width: "50%",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              color: "#fff",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            Sign Up with Google
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
}
