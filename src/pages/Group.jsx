// src/pages/Group.jsx
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
import MoreVertIcon from "@mui/icons-material/MoreVert"; // ADDED MoreVertIcon for mobile menu

// Section Icons for Group
import CampaignIcon from '@mui/icons-material/Campaign'; // Announcements
import SportsHandballIcon from '@mui/icons-material/SportsHandball'; // Activities
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'; // Volunteer
import BeachAccessIcon from '@mui/icons-material/BeachAccess'; // Get-Away
import ForestIcon from '@mui/icons-material/Forest'; // Camping

import { fetchUserProfilesByIds } from "../api";

export default function Group() {
  const location = useLocation();
  const navigate = useNavigate();
  const { group } = location.state || {};

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("members"); // Default selected section
  const [anchorEl, setAnchorEl] = useState(null); // For mobile menu

  const groupSections = [
    { name: "Members", icon: null, key: "members" }, // Members is always there, no specific icon here
    { name: "Activities", icon: <SportsHandballIcon />, key: "activities" },
    { name: "Announcements", icon: <CampaignIcon />, key: "announcements" },
    { name: "Volunteer", icon: <VolunteerActivismIcon />, key: "volunteer" },
    { name: "Get-Away", icon: <BeachAccessIcon />, key: "get-away" },
    { name: "Camping", icon: <ForestIcon />, key: "camping" },
  ];

  useEffect(() => {
    const loadMembers = async () => {
      if (!group || !group.memberUserIds || group.memberUserIds.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedMembers = await fetchUserProfilesByIds(group.memberUserIds);
        setMembers(fetchedMembers || []);
      } catch (err) {
        console.error("Error fetching group members:", err);
        setError(err.message || "Failed to load group members.");
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedSection === "members") {
      loadMembers();
    }
  }, [group, selectedSection]);

  const handleSectionClick = (key) => {
    setSelectedSection(key);
    handleCloseMenu(); // Close menu after selection on mobile
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
            Members ({group.memberCount})
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
              No members found for this group.
            </Typography>
          )}
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
      const sectionName = groupSections.find(s => s.key === selectedSection)?.name || 'Unknown';
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

  if (!group) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center", color: "#fff" }}>
        <Typography variant="h5" color="error">
          Group data not found.
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
    <Container maxWidth="lg" sx={{ mt: 8, color: "#fff" }}> {/* Changed to lg for more space */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/home")}
        sx={{ mb: 3, color: "#fff", borderColor: "#fff" }}
      >
      </Button>

      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          background: "rgba(255,255,255,0.05)", // Slightly darker background
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)", // Stronger shadow
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.2)", // Softer border
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontFamily: "Poppins, Segoe UI", fontWeight: 'bold', textAlign: 'center' }}>
          {group.groupName || "Unnamed Group"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "#ccc", textAlign: 'center' }}>
          Problem: {group.problem}, Cause: {group.cause}
        </Typography>

        <Divider sx={{ my: 4, borderColor: "#444" }} /> {/* Darker divider */}

        <Grid container spacing={4}>
          {/* Left Section for Large Screens */}
          <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}> {/* Hides on xs, shows on md and up */}
            <Box
              sx={{
                background: "rgba(255,255,255,0.08)", // Slightly lighter background for left panel
                borderRadius: 2,
                p: 2,
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <List>
                {groupSections.map((section) => (
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
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', mb: 2 }}> {/* Shows on xs, hides on md and up */}
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
                {groupSections.map((section) => (
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
                background: "rgba(255,255,255,0.08)", // Same as left panel
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)",
                minHeight: '400px', // Ensure some height for content
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