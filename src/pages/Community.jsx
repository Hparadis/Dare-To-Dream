// src/pages/Community.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Divider,
  Grid,
  // Hidden, // REMOVED THIS IMPORT
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Section Icons for Community
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // Music
import MovieIcon from '@mui/icons-material/Movie'; // Movies
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'; // Games
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'; // Gifts

// Assuming you have a similar API for fetching community members if needed
// For now, we'll keep it simple as the focus is on the UI structure
// import { fetchCommunityMembers } from "../api"; 

export default function Community() {
  const location = useLocation();
  const navigate = useNavigate();
  // If you pass community data via location state, you can access it here
  const { community } = location.state || {
    communityName: "Global Community", // Default for demonstration
    description: "Connect with people who share your interests!",
    // Example: If community has members, you can add memberUserIds here
    // memberUserIds: ["user1", "user2"], 
    // memberCount: 2
  }; 

  const [members, setMembers] = useState([]); // This state can be used if community has members
  const [loading, setLoading] = useState(false); // Set to false initially, as no member fetching is happening by default
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("members"); // Default selected section
  const [anchorEl, setAnchorEl] = useState(null); // For mobile menu

  const communitySections = [
    { name: "Members", icon: null, key: "members" }, // Default section, can be customized
    { name: "Music", icon: <MusicNoteIcon />, key: "music" },
    { name: "Movies", icon: <MovieIcon />, key: "movies" },
    { name: "Games", icon: <SportsEsportsIcon />, key: "games" },
    { name: "Gifts", icon: <CardGiftcardIcon />, key: "gifts" },
  ];

  // Example useEffect if you were to fetch community members
  // useEffect(() => {
  //   const loadCommunityMembers = async () => {
  //     if (!community || !community.memberUserIds || community.memberUserIds.length === 0) {
  //       setMembers([]);
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       setError(null);
  //       const fetchedMembers = await fetchCommunityMembers(community.memberUserIds);
  //       setMembers(fetchedMembers || []);
  //     } catch (err) {
  //       console.error("Error fetching community members:", err);
  //       setError(err.message || "Failed to load community members.");
  //       setMembers([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (selectedSection === "members") {
  //     loadCommunityMembers();
  //   }
  // }, [community, selectedSection]);

  const handleSectionClick = (key) => {
    setSelectedSection(key);
    handleCloseMenu();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const renderSectionContent = () => {
    if (selectedSection === "members") {
      return (
        <Box>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Members ({community.memberCount || 0}) {/* Display member count if available */}
          </Typography>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress color="inherit" />
            </Box>
          )}
          {error && (
            <Typography variant="body2" color="error" sx={{ my: 3 }}>
              Error: {error}
            </Typography>
          )}
          {!loading && !error && members.length === 0 && (
            <Typography variant="body2" sx={{ color: "#aaa", my: 3 }}>
              No members found for this community (or feature not implemented yet).
            </Typography>
          )}
          {/* Example of displaying members if fetched */}
          {!loading && !error && members.length > 0 && (
            <List sx={{ width: '100%', bgcolor: 'transparent', color: '#fff' }}>
              {members.map((member) => (
                <ListItem key={member.userId} sx={{ mb: 1, bgcolor: '#333', borderRadius: 2 }}>
                  <ListItemAvatar>
                    <Avatar src={member.profileImage || '/default-avatar.jpg'}>
                      {member.name ? member.name[0]?.toUpperCase() : 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="h6" sx={{ color: '#fff' }}>{member.name || 'Anonymous User'}</Typography>}
                    secondary={<Typography variant="body2" sx={{ color: '#ccc' }}>{member.description || 'No description provided.'}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      );
    } else {
      const sectionName = communitySections.find(s => s.key === selectedSection)?.name || 'Unknown';
      return (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            {sectionName}
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ color: "#aaa" }}>
            Coming Soon!
          </Typography>
        </Box>
      );
    }
  };

  // Provide a default community object if not passed via location state
  if (!community) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center", color: "#fff" }}>
        <Typography variant="h5" color="error">
          Community data not found.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/home")}
          sx={{ mt: 3 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 8, color: "#fff" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/home")}
        sx={{ mb: 3, color: "#fff", borderColor: "#fff" }}
      >
        Back to Home
      </Button>

      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontFamily: "Poppins, Segoe UI", fontWeight: 'bold', textAlign: 'center' }}>
          {community.communityName || "Unnamed Community"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "#ccc", textAlign: 'center' }}>
          {community.description || "No description provided."}
        </Typography>

        <Divider sx={{ my: 4, borderColor: "#444" }} />

        <Grid container spacing={4}>
          {/* Left Section for Large Screens */}
          <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 2,
                p: 2,
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <List>
                {communitySections.map((section) => (
                  <ListItem
                    button
                    key={section.key}
                    onClick={() => handleSectionClick(section.key)}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: selectedSection === section.key ? "rgba(255,255,255,0.15)" : "transparent",
                      '&:hover': {
                        bgcolor: "rgba(255,255,255,0.1)",
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'transparent' }}>
                        {section.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="h6" sx={{ color: '#fff' }}>{section.name}</Typography>} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          {/* Main Content Section */}
          <Grid item xs={12} md={9}>
            {/* Three-dot menu for small screens */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', mb: 2 }}>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                sx={{ color: '#fff' }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(30,30,30,0.9)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  },
                }}
              >
                {communitySections.map((section) => (
                  <MenuItem
                    key={section.key}
                    selected={section.key === selectedSection}
                    onClick={() => handleSectionClick(section.key)}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,255,255,0.15)',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {section.icon && <Box sx={{ mr: 1 }}>{section.icon}</Box>}
                      {section.name}
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Content Display Area */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)",
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {renderSectionContent()}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}