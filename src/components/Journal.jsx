// src/pages/Journal.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Journal({ onBack }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: new Date().toLocaleDateString(),
      text: 'Today I felt really productive and calm.',
    },
  ]);
  const [newEntry, setNewEntry] = useState('');
  const [editEntry, setEditEntry] = useState(null);

  const addEntry = () => {
    if (!newEntry.trim()) return;
    const today = new Date().toLocaleDateString();
    setEntries((prev) => [
      { id: Date.now(), date: today, text: newEntry.trim() },
      ...prev,
    ]);
    setNewEntry('');
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const openEditDialog = (entry) => {
    setEditEntry(entry);
  };

  const closeEditDialog = () => {
    setEditEntry(null);
  };

  const saveEdit = () => {
    if (!editEntry.text.trim()) return;
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === editEntry.id ? { ...editEntry, text: editEntry.text.trim() } : entry
      )
    );
    closeEditDialog();
  };

  return (
    <Box
      sx={{
        // --- RESIZING / FITTING CHANGES ---
        // Removed fixed width for md breakpoint, allowing it to scale.
        // Set a max-width for very large screens to keep content readable.
        width: '100%', // Take full width of its parent
        maxWidth: 800, // Max width of the content for readability on very large screens
        mx: 'auto', // Center the box horizontally
        // Added padding to account for the absolute positioning of the arrow
        // The 80px (theme.spacing(10)) ensures space for the title below the arrow
        p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
        pt: { xs: 8, sm: 10, md: 10 }, // Padding-top to push content below the arrow
        // --- END RESIZING / FITTING CHANGES ---

        mt: 0, // Removed top margin from the Box itself, controlled by parent layout
        minHeight: '100vh', // Make it take at least full viewport height
        bgcolor: 'rgba(255,255,255,0.05)',
        borderRadius: 0, // Often full-screen components don't have border-radius
        border: 'none', // Remove border for a cleaner full-screen look
        color: '#eee',
        position: 'relative', // Essential for the absolute positioning of the IconButton
      }}
    >
      {/* Back Arrow Button */}
      <IconButton
        onClick={onBack} // This calls the function passed from the parent
        sx={{
          position: 'absolute',
          top: { xs: theme.spacing(2), sm: theme.spacing(3) }, // Responsive top spacing
          left: { xs: theme.spacing(2), sm: theme.spacing(3) }, // Responsive left spacing
          color: '#fff',
          zIndex: 1, // Ensures it's above other content
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Journal Title - Centered and now has appropriate spacing from the top */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        My Journal
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          mb: 2,
        }}
      >
        {/* Placeholder for the journal title text field */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter journal title"
          sx={{ background: '#222', color: '#eee' }}
          InputProps={{ sx: { color: '#eee' } }}
        />
        <Typography sx={{ color: '#aaa' }}>Reminder: Reflect daily</Typography>
      </Box>

      <TextField
        label="Write your thoughts..."
        variant="filled"
        multiline
        minRows={4}
        fullWidth
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        sx={{
          mb: 2,
          bgcolor: '#222',
          '& .MuiInputBase-input': { color: '#eee' },
          '& .MuiInputLabel-root': { color: '#aaa' },
        }}
      />

      <Button variant="contained" onClick={addEntry} disabled={!newEntry.trim()}>
        Save Entry
      </Button>

      <Paper
        sx={{
          mt: 3,
          maxHeight: 400,
          overflowY: 'auto',
          bgcolor: '#1e1e1e',
          borderRadius: 1,
          border: '1px solid #333',
        }}
      >
        <List>
          {entries.length === 0 && (
            <Typography
              sx={{ p: 2, color: '#888', textAlign: 'center' }}
              variant="body2"
            >
              No journal entries yet.
            </Typography>
          )}
          {entries.map(({ id, date, text }) => (
            <ListItem
              key={id}
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                borderBottom: '1px solid #333',
                px: 2,
                py: 1,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 0.5,
                }}
              >
                <Typography variant="caption" color="#aaa">
                  {date}
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => openEditDialog({ id, date, text })}
                    sx={{ color: '#4db6ac' }}
                    aria-label="edit"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteEntry(id)}
                    sx={{ color: '#ff5555' }}
                    aria-label="delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <ListItemText
                primary={text}
                primaryTypographyProps={{ sx: { whiteSpace: 'pre-wrap' } }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={!!editEntry} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Journal Entry</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            minRows={4}
            fullWidth
            variant="outlined"
            value={editEntry?.text || ''}
            onChange={(e) =>
              setEditEntry((prev) => (prev ? { ...prev, text: e.target.value } : null))
            }
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={saveEdit}
            disabled={!editEntry?.text.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}