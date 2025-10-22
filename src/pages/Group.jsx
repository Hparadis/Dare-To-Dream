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
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import CampaignIcon from "@mui/icons-material/Campaign";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import ForestIcon from "@mui/icons-material/Forest";

import { fetchUserProfilesByIds } from "../api";
import Activities from "../Group_things/Activities";
import Announcements from "../Group_things/Announcements";
import Volunteer from "../Group_things/Volunteer";
import GetAway from "../Group_things/GetAway";
import Camping from "../Group_things/Camping";

// Firebase
import { getAuth } from "firebase/auth";

export default function Group() {
  const location = useLocation();
  const navigate = useNavigate();
  const { group } = location.state || {};

  // Firebase current user
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("members");
  const [anchorEl, setAnchorEl] = useState(null);

  const groupSections = [
    { name: "Members", icon: null, key: "members" },
    { name: "Activities", icon: <SportsHandballIcon />, key: "activities" },
    { name: "Announcements", icon: <CampaignIcon />, key: "announcements" },
    { name: "Volunteer", icon: <VolunteerActivismIcon />, key: "volunteer" },
    { name: "Get-Away", icon: <BeachAccessIcon />, key: "get-away" },
    { name: "Camping", icon: <ForestIcon />, key: "camping" },
  ];

  useEffect(() => {
    const loadMembers = async () => {
      if (!group || !group.members || group.members.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedMembers = await fetchUserProfilesByIds(group.members);
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
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Members ({group.members ? group.members.length : 0})
          </Typography>
  
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
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
            <List sx={{ width: "100%", bgcolor: "transparent", color: "#fff" }}>
              {members.map((member) => (
                <ListItem
                  key={member.userId}
                  sx={{ mb: 1, bgcolor: "#333", borderRadius: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar src={member.profileImage || "/default-avatar.jpg"}>
                      {member.name ? member.name[0]?.toUpperCase() : "U"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ color: "#fff" }}>
                        {member.name || "Anonymous User"}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: "#ccc" }}>
                        {member.description || "No description provided."}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      );
    } else if (selectedSection === "activities") {
      return <Activities groupId={group.id} currentUser={currentUser} />;
    } else if (selectedSection === "announcements") {
      return <Announcements groupId={group.id} currentUser={currentUser} />;
    } else if (selectedSection === "volunteer") {
      return <Volunteer groupId={group.id} currentUser={currentUser} />;
    } else if (selectedSection === "getaway") {
      return <GetAway groupId={group.id} currentUser={currentUser} />;
    } else if (selectedSection === "camping") {
      return <Camping groupId={group.id} currentUser={currentUser} />;
    } else {
      const sectionName =
        groupSections.find((s) => s.key === selectedSection)?.name || "Unknown";
      return (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            {sectionName}
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ color: "#aaa" }}
          >
            Coming Soon!
          </Typography>
        </Box>
      );
    }
  };

  if (!group) {
    return (
      <Container
        maxWidth="md"
        sx={{ mt: 8, textAlign: "center", color: "#fff" }}
      >
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
    <Container maxWidth="lg" sx={{ mt: 8, color: "#fff" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/home")}
        sx={{ mb: 3, color: "#fff", borderColor: "#fff" }}
      ></Button>

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
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "Poppins, Segoe UI",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {group.groupName || "Unnamed Group"}
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 3, color: "#ccc", textAlign: "center" }}
        >
          Problem: {group.problem}, Cause: {group.cause}
        </Typography>

        <Divider sx={{ my: 4, borderColor: "#444" }} />

        <Grid container spacing={4}>
          <Grid item md={3} sx={{ display: { xs: "none", md: "block" } }}>
            <Box
              sx={{
                background: "rgba(255,255,255,0.08)",
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
                      bgcolor:
                        selectedSection === section.key
                          ? "rgba(255,255,255,0.15)"
                          : "transparent",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "transparent" }}>{section.icon}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ color: "#fff" }}>
                          {section.name}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Box
              sx={{ display: { xs: "flex", md: "none" }, justifyContent: "flex-end", mb: 2 }}
            >
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                sx={{ color: "#fff" }}
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
                    bgcolor: "rgba(30,30,30,0.9)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                  },
                }}
              >
                {groupSections.map((section) => (
                  <MenuItem
                    key={section.key}
                    selected={section.key === selectedSection}
                    onClick={() => handleSectionClick(section.key)}
                    sx={{
                      "&.Mui-selected": {
                        bgcolor: "rgba(255,255,255,0.15)",
                      },
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {section.icon && <Box sx={{ mr: 1 }}>{section.icon}</Box>}
                      {section.name}
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)",
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
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
