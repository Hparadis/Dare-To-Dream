import React, { useState,useEffect } from "react";
import { Container, Paper, Grid, Typography, Button, Divider, CircularProgress } from "@mui/material";
import CustomTextField from "./CustomTextField";
import tracker from "../tracker";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth , db } from "../config/firebase"; // ✅ correct
import { useUser } from "../context/UserContext";
import { doc, setDoc } from "firebase/firestore";



export default function SignupPage() {
  const { setUserName, setUserDescription } = useUser();
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    const { firstName, lastName, email, password } = formData;
  
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);

      // ✅ Save profile info in Firestore
      const userDocRef = doc(db, "Surveys", userCredential.user.uid);
      await setDoc(userDocRef, {
        name: firstName,
        description: "", // You can optionally collect this during signup
        createdAt: new Date().toISOString(),
      }, { merge: true });

      // ✅ Set user info in context
      setUserName(firstName);
      setUserDescription("");

      navigate("/survey");
    } catch (error) {
      console.error("Sign-up error:", error);
  
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("This email is already in use.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError("Sign-up failed. " + error.message);
          break;
      }
    } finally {
      setLoading(false);
    }
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
                data-testid="signup-button"
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
          Google
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
}
