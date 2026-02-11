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
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { auth } from "../config/firebase";
import { BASE_URL } from "../api";
 // ✅ make sure this path is correct

// Custom styled Dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "rgba(51,51,51,0.9)",
    backdropFilter: "blur(10px)",
    border: "1px solid #33",
    color: "#fff",
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    maxWidth: 600,
    width: "90%",
  },
}));

export default function CreateGroupCommunityModal({ isOpen, onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState(""); // group or community
  const [visibility, setVisibility] = useState(""); // public/private
  const [maxMembers, setMaxMembers] = useState(10); // for private
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [invited, setInvited] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dummy search function (replace with API)
  const handleSearch = () => {
    const dummyUsers = [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
      { id: "3", name: "Charlie" }
    ];
    const results = dummyUsers.filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddMember = (user) => {
    if (!invited.some(u => u.id === user.id) && invited.length < 20) {
      setInvited([...invited, user]);
    }
  };

  const handleRemoveInvite = (id) => {
    setInvited(invited.filter(u => u.id !== id));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const token = await user.getIdToken();

      const payload = {
        type,
        visibility,
        maxMembers: visibility === "private" ? maxMembers : invited.length || 20,
        name,
        description,
        invitedMembers: invited.map(u => u.id),
      };

      console.log("Submitting:", payload);

      const url =
        type === "group"
          ? `${BASE_URL}/api/groups/create`
          : `${BASE_URL}/api/communities/create`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || `${type} created successfully!`);
        if (onCreated) onCreated(result); // notify parent so list refreshes
        onClose();
        // Reset
        setStep(1);
        setType("");
        setVisibility("");
        setMaxMembers(10);
        setName("");
        setDescription("");
        setSearchTerm("");
        setSearchResults([]);
        setInvited([]);
      } else {
        alert(result.error || result.message || "Error creating group/community");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDialog open={isOpen} onClose={onClose}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <DialogTitle sx={{ m: 0, p: 0 }}>
          Create {type || "Group/Community"}
        </DialogTitle>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers>
        {/* Step 1: Choose Type */}
        {step === 1 && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => { setType(e.target.value); setStep(2); }}
            >
              <MenuItem value="group">Group</MenuItem>
              <MenuItem value="community">Community</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Step 2: Visibility & Rules */}
        {step === 2 && (
          <>
            <Typography sx={{ mb: 1 }}>Rules & Visibility:</Typography>
            {type === "group" && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Max 20 members. Private groups can specify max members.
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Visibility</InputLabel>
                  <Select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                  </Select>
                </FormControl>
                {visibility === "private" && (
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Members"
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                    sx={{ mb: 2 }}
                  />
                )}
              </>
            )}
            {type === "community" && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Communities are usually public, max 20 members per joinable session.
                </Typography>
                <TextField
                  fullWidth
                  label="Visibility"
                  value="public"
                  disabled
                  sx={{ mb: 2 }}
                />
              </>
            )}
            <Button variant="contained" onClick={() => setStep(3)}>Next</Button>
          </>
        )}

        {/* Step 3: Name + Description */}
        {step === 3 && (
          <>
            <TextField
              fullWidth
              label={`${type} Name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={() => setStep(4)}>Next</Button>
          </>
        )}

        {/* Step 4: Invite Members */}
        {step === 4 && (
          <>
            <TextField
              fullWidth
              label="Search users to invite"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button onClick={handleSearch} sx={{ mb: 2 }}>Search</Button>
            <List sx={{ maxHeight: 150, overflowY: "auto" }}>
              {searchResults.map((user) => (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <IconButton onClick={() => handleAddMember(user)}>
                      <AddIcon sx={{ color: "#fff" }} />
                    </IconButton>
                  }
                >
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>

            <Typography sx={{ mt: 2 }}>Invited Members:</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {invited.map((u) => (
                <Chip
                  key={u.id}
                  label={u.name}
                  onDelete={() => handleRemoveInvite(u.id)}
                  sx={{ bgcolor: "#33", color: "#fff" }}
                />
              ))}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        {step === 4 && (
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ backgroundColor: "#2196f3", color: "#fff", "&:hover": { backgroundColor: "#1976d2" } }}
          >
            {loading ? "Creating..." : `Create ${type}`}
          </Button>
        )}
      </DialogActions>
    </StyledDialog>
  );
}
