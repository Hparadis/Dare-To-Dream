// src/components/AppHeader.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  styled,
  Paper,
  alpha,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom"; // Link is used here
import NotificationBell from "./NotificationBell"; // Assuming this path is correct
import EditIcon from "@mui/icons-material/Edit";
import { useUser } from "../context/UserContext"; // Assuming this path is correct

// Import the new overlay components
import LegacyOverlay from "./LegacyOverlay";
import EmotionalSpectrumOverlay from "./EmotionalSpectrumOverlay";
import SettingsOverlay from "./SettingsOverlay";
import ProfileDetailsOverlay from "./ProfileDetailsOverlay";

const ProfileBox = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  // Initial state, no border
  "& .MuiAvatar-root": {
    transition: "border 0.3s ease-in-out",
  },
  "&:hover .MuiAvatar-root": {
    // This is a placeholder for the gradient border.
    // MUI doesn't directly support CSS gradients for borders easily on Avatar.
    // A common workaround is to use a pseudo-element or a background-image on the parent/wrapper.
    // For simplicity, we'll simulate a border with a background and padding here,
    // or use a pseudo-element for a true gradient border.
    // Let's use a pseudo-element approach for better gradient control.
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: -3, // Adjust for border thickness
    left: -3, // Adjust for border thickness
    right: -3, // Adjust for border thickness
    bottom: -3, // Adjust for border thickness
    borderRadius: "50%",
    padding: "3px", // Border thickness
    background: "linear-gradient(45deg, #FF6B8B 0%, #6200EE 50%, #03DAC6 100%)", // Light purple/pink to teal gradient
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
    zIndex: -1, // Behind the avatar
  },
  "&:hover::before": {
    opacity: 1,
  },
}));

export default function AppHeader({ isAnonymous, onAvatarChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null); 
  const { profileImage } = useUser();
  const { userName, userDescription } = useUser(); 

  // State for new overlays visibility
  const [isLegacyOverlayOpen, setLegacyOverlayOpen] = useState(false);
  const [isEmotionalSpectrumOverlayOpen, setEmotionalSpectrumOverlayOpen] = useState(false);
  const [isSettingsOverlayOpen, setSettingsOverlayOpen] = useState(false);
  const [isProfileDetailsOverlayOpen, setProfileDetailsOverlayOpen] =
    useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenLegacy = () => {
    handleMenuClose(); // Close the menu
    setLegacyOverlayOpen(true); // Open the Legacy overlay
  };

  const handleOpenEmotionalSpectrum = () => {
    handleMenuClose(); // Close the menu
    setEmotionalSpectrumOverlayOpen(true); // Open the Emotional Spectrum overlay
  };

  const handleOpenSettings = () => {
    handleMenuClose(); // Close the menu
    setSettingsOverlayOpen(true); // Open the Settings overlay
  };

  const avatarSrc = profileImage || (isAnonymous ? "/anonymous-avatar.png" : "");
  const currentUser = {
    name: userName || "Dreamer User", // Use from context or default
    description: userDescription || "Aspiring to achieve greatness.", // Use from context or default
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "transparent",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: "#fff", textDecoration: "none" }}
          >
            Dare To Dream
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NotificationBell />

            <Box sx={{ position: "relative", display: "inline-block" }}>
              <IconButton component={Link} to="/friends" aria-label="Profile">
                <Avatar
                  src={avatarSrc}
                  alt="User Avatar"
                  sx={{ width: 40, height: 40 }}
                />
              </IconButton>

              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  width: 20,
                  height: 20,
                  p: 0,
                  borderRadius: "50%",
                  boxShadow: "0 0 2px rgba(0,0,0,0.5)",
                }}
                onClick={() => {
                  if (!isAnonymous) {
                    document.getElementById("avatar-upload").click();
                  }
                }}
                disabled={isAnonymous}
                aria-label="Edit Avatar"
              >
                <EditIcon sx={{ fontSize: 14 }} />
              </IconButton>

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && onAvatarChange && !isAnonymous) {
                    const url = URL.createObjectURL(file);
                    onAvatarChange(url);
                  }
                }}
                style={{ display: "none" }}
              />
            </Box>

            <IconButton onClick={handleMenuOpen} aria-label="Menu">
              <MoreVertIcon sx={{ color: "#fff" }} />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose} component={Link} to="/progress">
                Progress
              </MenuItem>
              <MenuItem onClick={handleOpenLegacy}>Legacy</MenuItem>
              <MenuItem onClick={handleOpenEmotionalSpectrum}>Emotional Spectrum</MenuItem>
              <MenuItem onClick={handleOpenSettings}>Settings</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Overlays rendered here */}
      <LegacyOverlay
        isOpen={isLegacyOverlayOpen}
        onClose={() => setLegacyOverlayOpen(false)}
      />
      <EmotionalSpectrumOverlay
        isOpen={isEmotionalSpectrumOverlayOpen}
        onClose={() => setEmotionalSpectrumOverlayOpen(false)}
      />
      <SettingsOverlay
        isOpen={isSettingsOverlayOpen}
        onClose={() => setSettingsOverlayOpen(false)}
      />
    </>
  );
}