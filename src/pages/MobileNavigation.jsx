// src/pages/MobileNavigation.jsx
import React, { useState, useEffect } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Fab,
  TextField,
  InputAdornment,
  Box,
  IconButton,
  Collapse,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { fetchGroups } from "../api";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";


export default function MobileNavigation({
  onNavClick,
  onCreateClick,
  setShowCommunities,
  setShowFriends,
  setShowGroups,
  setPostModalOpen,
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [value, setValue] = useState(null);
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestText, setSuggestText] = useState("");

  const handleNavChange = (event, newValue) => {
    setValue(newValue);
    onNavClick?.(newValue);
    if (newValue === "groups") {
      setShowGroups(true);
      setShowCommunities(false);
      setShowFriends(false);
    } else if (newValue === "communities") {
      setShowGroups(false);
      setShowCommunities(true);
      setShowFriends(false);
    } else if (newValue === "friends") {
      setShowGroups(false);
      setShowCommunities(false);
      setShowFriends(true);
    }
  };

  const handleSuggestSubmit = () => {
    if (suggestText.trim()) {
      console.log("Suggestion submitted:\n", suggestText);
      setSuggestText("");
      setShowSuggest(false);
    }
  };
  const onEditClick = () => {
    console.log("Edit button clicked");
  };
  

  return (
    <>
      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "#333",
          borderTop: "1px solid #33",
        }}
        elevation={4}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleNavChange}
          sx={{ backgroundColor: "#333", color: "#fff" }}
        >
          <BottomNavigationAction
            value="friends"
            icon={<PersonIcon sx={{ color: "#fff" }} />}
          />
          <BottomNavigationAction
            value="groups"
            icon={<WorkspacesIcon sx={{ color: "#fff" }} />}
          />
          <BottomNavigationAction
            value="communities"
            icon={<Diversity2Icon sx={{ color: "#fff" }} />}
          />
        </BottomNavigation>
      </Paper>

      {/* Floating Buttons - Only on Small Screens */}
      {isSmallScreen && (
  <>
    {/* Floating Action Buttons */}
    <Box
      sx={{
        position: "fixed",
        bottom: 80,
        right: 16,
        zIndex: 1500,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(0,0,0,0.8)",
        borderRadius: 2,
        border: "2px solid #fff",
        overflow: "hidden",
      }}
    >
      {/* Suggest */}
      <Tooltip title="Suggest" placement="left">
        <IconButton
          onClick={() => setShowSuggest((prev) => !prev)}
          sx={{ color: "#fff", borderBottom: "1px solid #fff", borderRadius: 0 }}
        >
          <LightbulbIcon />
        </IconButton>
      </Tooltip>

      {/* Create */}
      <Tooltip title="Create" placement="left">
        <IconButton
          onClick={onCreateClick}
          sx={{ color: "#fff", borderBottom: "1px solid #fff", borderRadius: 0 }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>

      {/* Post */}
      <Tooltip title="Post" placement="left">
        <IconButton
          onClick={() => setPostModalOpen(true)}
          sx={{ color: "#fff", borderRadius: 0 }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </Box>

    {/* Suggest Field */}
    <Collapse in={showSuggest} timeout="auto" unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          bottom: 220,
          right: 16,
          width: 260,
          p: 1,
          borderRadius: 1,
          zIndex: 1550,
        }}
      >
        <TextField
          value={suggestText}
          onChange={(e) => setSuggestText(e.target.value)}
          placeholder="Your suggestion..."
          size="small"
          fullWidth
          InputProps={{
            sx: {
              backgroundColor: "#fff",
              borderRadius: 1,
              fontSize: "0.85rem",
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSuggestSubmit}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Collapse>
  </>
)}




    </>
  );
}
