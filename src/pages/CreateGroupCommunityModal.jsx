// src/pages/CreateGroupCommunityModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";

// Custom styled Dialog (keep this as is)
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "rgba(51,51,51,0.9)",
    backdropFilter: "blur(10px)",
    border: "1px solid #33",
    color: "#fff",
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    maxWidth: 500,
    width: "90%",
  },
}));

export default function CreateGroupCommunityModal({ isOpen, onClose }) {
  const [type, setType] = useState("group");
  const [suggestion, setSuggestion] = useState(""); // This will be the group/community name
  const [members, setMembers] = useState([""]);

  const handleAddMemberField = () => {
    setMembers([...members, ""]);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  // --- IMPORTANT: Update the handleSubmit function ---
  const handleSubmit = async () => { // Make it async to use await
    const payload = {
      type,
      suggestion,
      members: members.filter(email => email.trim() !== ""), // Filter out empty emails
    };
    console.log("Submitting payload to backend:", payload);

    try {
      // Send a POST request to your Flask backend's /groups/create endpoint
      const response = await fetch('http://127.0.0.1:5000/groups/create', { // Use full URL for development
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If you implement authentication later, you'd add 'Authorization' header here
        },
        body: JSON.stringify(payload), // Convert the JavaScript object to a JSON string
      });

      const result = await response.json(); // Parse the JSON response from the backend

      if (response.ok) { // Check if the HTTP status code is 2xx (success)
        console.log("Group/Community created successfully:", result);
        alert(result.message); // Show a success message to the user
        onClose(); // Close the modal

        // Reset form states for the next use
        setType("group");
        setSuggestion("");
        setMembers([""]);
      } else {
        // Handle backend errors
        console.error("Error creating group/community:", result.message);
        alert(`Failed to create ${type}: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      // Handle network errors or issues with the fetch request itself
      console.error("Network or API call error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <StyledDialog open={isOpen} onClose={onClose}>
      {/* Header with title and close button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <DialogTitle sx={{ m: 0, p: 0 }}>
          Create {type === "group" ? "Group" : "Community"}
        </DialogTitle>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers>
        {/* Input field for Group/Community Name */}
        <TextField
          fullWidth
          variant="outlined"
          label={type === "group" ? "Group Name" : "Community Name"}
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#33" },
              color: "#fff"
            },
            "& .MuiInputLabel-root": { color: "#fff" }
          }}
        />

        {/* Select dropdown to choose type: Group or Community */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: "#fff" }}>Select Type</InputLabel>
          <Select
            value={type}
            label="Select Type"
            onChange={(e) => setType(e.target.value)}
            sx={{
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#33" }
            }}
          >
            <MenuItem value="group">Group</MenuItem>
            <MenuItem value="community">Community</MenuItem>
          </Select>
        </FormControl>

        {/* Dynamic input fields for member emails */}
        {members.map((member, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label={`Invite Email ${index + 1}`}
              value={member}
              onChange={(e) => handleMemberChange(index, e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#33" },
                  color: "#fff"
                },
                "& .MuiInputLabel-root": { color: "#fff" }
              }}
            />
            {/* Show Add button only on the last member field */}
            {index === members.length - 1 && (
              <IconButton
                onClick={handleAddMemberField}
                sx={{ color: "#fff", border: "1px solid #33", borderRadius: "50%" }}
              >
                <AddCircleIcon />
              </IconButton>
            )}
          </Box>
        ))}
      </DialogContent>

      <DialogActions>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#2196f3",
            color: "#fff",
            "&:hover": { backgroundColor: "#1976d2" },
            py: 1.5
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}