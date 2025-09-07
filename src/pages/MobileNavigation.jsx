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
  Collapse, // Keep Collapse if you still use it elsewhere, otherwise remove
  useMediaQuery,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress, // Added for submit button loading
  Button, // Added for dialog buttons
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
// import { fetchGroups } from "../api"; // Removed: This import was unused
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import CreateGroupCommunityModal from "./CreateGroupCommunityModal";

// Import Firebase auth and app instance
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase"; // Assuming your firebase app instance is exported from here

// Mock API call for suggestion submission (REPLACE WITH YOUR ACTUAL API)
const submitSuggestionApi = async (suggestion, userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (suggestion.length > 5) {
        console.log("Suggestion submitted:", suggestion, "by user:", userId);
        resolve({ success: true, message: "Thank you for your suggestion!" });
      } else {
        resolve({ success: false, message: "Suggestion is too short." });
      }
    }, 1000);
  });
};

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
  const auth = getAuth(app); // Initialize auth here

  const [value, setValue] = useState(null);
  // Removed: const [showSuggest, setShowSuggest] = useState(false);
  // Removed: const [suggestText, setSuggestText] = useState("");

  // States for the Dialog-based suggestion box
  const [openSuggestionDialog, setOpenSuggestionDialog] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openCreateModal, setOpenCreateModal] = useState(false);


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

  // Removed: handleSuggestSubmit as it's for the old Collapse method
  // const handleSuggestSubmit = () => { ... };

  const onEditClick = () => {
    console.log("Edit button clicked");
  };

  // Handler to open the new suggestion dialog
  const handleSuggestClick = () => {
    setOpenSuggestionDialog(true);
  };

  // Handler to close the new suggestion dialog
  const handleCloseSuggestionDialog = () => {
    setOpenSuggestionDialog(false);
    setSuggestionText(""); // Clear text when closing
    setSnackbarOpen(false); // Close snackbar if open
  };

  // Handler to submit the suggestion
  const handleSubmitSuggestion = async () => {
    if (!suggestionText.trim()) {
      setSnackbarMessage("Suggestion cannot be empty.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setIsSubmittingSuggestion(true);
    // Get user ID from Firebase Auth
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous";
    try {
      const response = await submitSuggestionApi(suggestionText, userId);
      setSnackbarMessage(response.message);
      setSnackbarSeverity(response.success ? "success" : "error");
      setSnackbarOpen(true);
      if (response.success) {
        setSuggestionText(""); // Clear the input field
        setTimeout(() => {
          handleCloseSuggestionDialog(); // Close dialog after successful submission
        }, 1500); // Give user time to read success message
      }
    } catch (error) {
      setSnackbarMessage("Failed to submit suggestion. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error submitting suggestion:", error);
    } finally {
      setIsSubmittingSuggestion(false);
    }
  };

  // Handler to close the snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
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
          backgroundColor: "transparent",
          borderTop: "1px solid #333",
        }}
        elevation={4}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleNavChange}
          sx={{ backgroundColor: "transparent", color: "#fff", borderTop: "1px solid rgba(255,255,255,0.3)",}}
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
          {/* Floating Action Buttons Container */}
          <Box
            sx={{
              position: "fixed",
              bottom: 80,
              right: 16,
              zIndex: 1500,
              display: "flex",
              flexDirection: "column",
              borderRadius: 4,
              border: "2px solid #fff",
              overflow: "hidden",
            }}
          >
            {/* Suggest Button - Now opens the Dialog */}
            <Tooltip title="Suggest" placement="left">
              <IconButton
                onClick={handleSuggestClick} // Changed to open the Dialog
                sx={{ color: "#fff", borderBottom: "1px solid #fff", borderRadius: 0 }}
              >
                <LightbulbIcon />
              </IconButton>
            </Tooltip>

            {/* Create Button */}
            <Tooltip title="Create" placement="left">
            <IconButton
              onClick={() => setOpenCreateModal(true)}
              sx={{ color: "#fff", borderBottom: "1px solid #fff", borderRadius: 0 }}
            >
              <AddIcon />
            </IconButton>
            <CreateGroupCommunityModal
                  isOpen={openCreateModal}
                  onClose={() => setOpenCreateModal(false)}
                />

            </Tooltip>

            {/* Post Button */}
            <Tooltip title="Post" placement="left">
              <IconButton
                onClick={() => setPostModalOpen(true)}
                sx={{ color: "#fff", borderRadius: 0 }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Suggestion Dialog */}
          <Dialog open={openSuggestionDialog} onClose={handleCloseSuggestionDialog} fullWidth maxWidth="sm" sx={{borderRadius: 4}}>
            <DialogTitle sx={{ bgcolor: "#333", color: "#fff" }}>Submit a Suggestion</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                id="suggestion"
                label="Your Suggestion"
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                placeholder="Tell us what you think or what new features you'd like to see!"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSuggestionDialog} color="primary" disabled={isSubmittingSuggestion}>
                Cancel
              </Button>
              <Button onClick={handleSubmitSuggestion} color="primary" variant="contained" disabled={isSubmittingSuggestion}>
                {isSubmittingSuggestion ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for submission feedback */}
          <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
}