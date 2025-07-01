// src/components/CreateGroupCommunityModal.jsx
import React, { useState, useEffect } from "react"; // Added useEffect for logging
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Slide,
} from "@mui/material";

// Transition for the modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateGroupCommunityModal({ open, onClose, onCreateGroup, onCreateCommunity }) {
  const [tabValue, setTabValue] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // --- DEBUG LOG ---
  useEffect(() => {
    console.log("CreateGroupCommunityModal rendered. Open state:", open);
  }, [open]);
  // --- END DEBUG LOG ---

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = () => {
    if (tabValue === 0) { // Create Group
      onCreateGroup(name, description);
    } else { // Create Community
      onCreateCommunity(name, description);
    }
    // Reset form fields
    setName("");
    setDescription("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
      // Ensure PaperProps styles are applied directly to the Dialog's paper component
      PaperProps={{
        sx: {
          backgroundColor: '#222', // Solid dark background
          color: '#fff',
          borderRadius: 2,
          boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
          zIndex: 1700, // Very high zIndex to ensure it's on top
          position: 'relative', // Ensure zIndex applies correctly
          // For mobile, make it full screen or larger
          '@media (max-width:600px)': {
            margin: 0,
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            borderRadius: 0,
          },
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.8)', // Darker, more opaque backdrop
          zIndex: 1699, // Ensure backdrop is below modal but above other content
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
          Create New
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{
            mb: 2,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-indicator': { backgroundColor: '#2196f3' }, // Blue indicator
            '& .MuiTab-root': { color: '#ccc' }, // Light gray text for inactive tabs
            '& .Mui-selected': { color: '#fff', fontWeight: 'bold' }, // White text for active tab
          }}
        >
          <Tab label="Group" />
          <Tab label="Community" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{ sx: { color: "#fff" } }}
            InputLabelProps={{ sx: { color: "#fff" } }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{ sx: { color: "#fff" } }}
            InputLabelProps={{ sx: { color: "#fff" } }}
          />
          {/* Add members to add logic here later if needed */}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: '#aaa' }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#2196f3', '&:hover': { backgroundColor: '#1976d2' } }}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
