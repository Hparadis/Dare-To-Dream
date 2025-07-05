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
  alpha, // Import alpha for dynamic transparency
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Journal({ onBack }) {
  const theme = useTheme();
  // Using theme breakpoints for more robust responsiveness
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [entries, setEntries] = useState([
    {
      id: 1,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      text: 'Today I felt really productive and calm. I managed to finish my tasks ahead of schedule and also took some time for meditation.',
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      text: "Yesterday was a bit challenging. I faced some unexpected roadblocks, but I'm proud of how I handled the stress.",
    },
  ]);
  const [newEntry, setNewEntry] = useState('');
  const [editEntry, setEditEntry] = useState(null);

  const addEntry = () => {
    if (!newEntry.trim()) return;
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
        width: '100%', // Takes full available width
        maxWidth: 800, // Max width for content readability on large screens
        mx: 'auto', // Centers the content horizontally

        // Responsive padding, especially top padding to clear the absolute arrow
        p: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 8, sm: 10, md: 10 }, // Increased top padding for arrow clearance

        mt: 0, // No margin-top needed as parent controls positioning
        minHeight: '100vh', // Ensure it takes at least full viewport height
        bgcolor: alpha(theme.palette.background.paper, 0.05), // Consistent glassmorphic background
        borderRadius: theme.shape.borderRadius, // Use theme's border radius
        border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`, // Soft border for depth
        color: "#fff", // Consistent text color
        position: 'relative', // Essential for the absolute positioning of the IconButton
        boxSizing: 'border-box', // Include padding in the element's total width and height
      }}
    >
      {/* Back Arrow Button */}
      <IconButton
        onClick={onBack} // Calls the onBack function passed from Progress.jsx
        sx={{
          position: 'absolute',
          top: { xs: theme.spacing(2), sm: theme.spacing(3) }, // Responsive top spacing
          left: { xs: theme.spacing(2), sm: theme.spacing(3) }, // Responsive left spacing
          color: "#fff", // White color for the arrow
          zIndex: 1, // Ensures it's above other content
          transition: 'transform 0.3s ease-in-out', // Smooth transition on hover
          '&:hover': {
            transform: 'scale(1.1)', // Slightly enlarge on hover
            bgcolor: alpha(theme.palette.primary.main, 0.1), // Subtle hover background
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Journal Title */}
      <Typography
        variant="h3"
        sx={{
          mb: 3,
          fontWeight: 'bold',
          textAlign: 'center',
          color: "#fff", // A slightly brighter color for the title
        }}
      >
        My Journal
      </Typography>

      {/* Optional: Journal Title TextField and Reminder */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Stacks on small screens
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' }, // Stretches on small screens
          gap: 2,
          mb: 2,
          p: { xs: 0, sm: 1 }, // Small horizontal padding on very small screens
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Daily thought summary..."
          sx={{
            background: alpha(theme.palette.grey[900], 0.6), // Darker background for input
            borderRadius: theme.shape.borderRadius,
            '& .MuiOutlinedInput-root': {
              color: "#fff",
              '& fieldset': { borderColor: alpha(theme.palette.common.white, 0.3) },
              '&:hover fieldset': { borderColor: theme.palette.primary.light },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
            },
            '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
          }}
          InputProps={{ sx: { color: theme.palette.text.primary } }} // Ensure input text color
        />
        <Typography
          sx={{
            color: "#fff",
            minWidth: 'fit-content', // Prevent reminder from shrinking too much
            textAlign: { xs: 'center', md: 'right' },
          }}
          variant="body2"
        >
          💡 Reflect daily for growth.
        </Typography>
      </Box>

      {/* Main Journal Entry TextField */}
      <TextField
        label="What's on your mind today?"
        variant="filled"
        multiline
        minRows={4}
        fullWidth
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        sx={{
          mb: 2,
          bgcolor: alpha(theme.palette.grey[900], 0.6), // Darker background for consistency
          borderRadius: theme.shape.borderRadius, // Apply border radius
          '& .MuiInputBase-input': { color: "#fff", },
          '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
          '& .MuiFilledInput-root': {
            borderRadius: theme.shape.borderRadius, // Ensure border radius applies to filled variant
            '&:before': { borderBottom: 'none !important' }, // Remove default filled underline
            '&:after': { borderBottom: 'none !important' }, // Remove default filled underline on focus
            '&:hover:not(.Mui-disabled):before': { borderBottom: 'none !important' },
          },
        }}
      />

      {/* Save Entry Button */}
      <Button
        variant="contained"
        onClick={addEntry}
        disabled={!newEntry.trim()}
        sx={{
          py: 1.5,
          px: 4,
          fontWeight: 'bold',
          letterSpacing: 1,
          bgcolor: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
            boxShadow: theme.shadows[6],
          },
          '&.Mui-disabled': {
            bgcolor: alpha(theme.palette.primary.main, 0.3),
            color: alpha(theme.palette.common.white, 0.6),
          },
        }}
      >
        Save Entry
      </Button>

      {/* Journal Entries List */}
      <Paper
        sx={{
          mt: 3,
          maxHeight: 400, // Fixed height for scrollable area
          overflowY: 'auto', // Scrollbar for entries
          bgcolor: alpha(theme.palette.grey[900], 0.4), // Semi-transparent dark background
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          // Custom scrollbar for better aesthetics
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.common.black, 0.2),
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.primary.main, 0.6),
            borderRadius: '10px',
            '&:hover': {
              background: theme.palette.primary.main,
            },
          },
        }}
      >
        <List>
          {entries.length === 0 && (
            <Typography
              sx={{ p: 3, color: theme.palette.text.secondary, textAlign: 'center' }}
              variant="body1"
            >
              Start your journey! Write your first entry above.
            </Typography>
          )}
          {entries.map(({ id, date, text }) => (
            <ListItem
              key={id}
              sx={{
                flexDirection: 'column', // Stacks date, text, and buttons
                alignItems: 'flex-start',
                borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`, // Subtle separator
                px: 3,
                py: 2,
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.grey[800], 0.2), // Light hover effect
                },
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                  flexWrap: 'wrap', // Allow date/buttons to wrap on very small screens
                }}
              >
                <Typography variant="caption" color={theme.palette.text.secondary} sx={{ fontWeight: 'bold' }}>
                  {date}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => openEditDialog({ id, date, text })}
                    sx={{ color: theme.palette.info.light }} // A distinct edit color
                    aria-label="edit"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteEntry(id)}
                    sx={{ color: theme.palette.error.light }} // A distinct delete color
                    aria-label="delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  sx: {
                    whiteSpace: 'pre-wrap', // Preserve line breaks in text
                    color: "#fff",
                    fontSize: { xs: '0.9rem', sm: '1rem' }, // Responsive font size
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={!!editEntry}
        onClose={closeEditDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: alpha(theme.palette.background.paper, 0.95), // Slightly more opaque background
            color: "#fff",
            borderRadius: theme.shape.borderRadius * 2, // More rounded dialog
            border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.dark, color: theme.palette.common.white }}>
          Edit Journal Entry
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            multiline
            minRows={4}
            fullWidth
            variant="outlined"
            value={editEntry?.text || ''}
            onChange={(e) =>
              setEditEntry((prev) => (prev ? { ...prev, text: e.target.value } : null))
            }
            sx={{
              mt: 1,
              bgcolor: alpha(theme.palette.grey[900], 0.6),
              borderRadius: theme.shape.borderRadius,
              '& .MuiOutlinedInput-root': {
                color: theme.palette.text.primary,
                '& fieldset': { borderColor: alpha(theme.palette.common.white, 0.3) },
                '&:hover fieldset': { borderColor: theme.palette.primary.light },
                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
              },
              '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={closeEditDialog} sx={{ color: theme.palette.text.secondary }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveEdit}
            disabled={!editEntry?.text.trim()}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.dark },
              '&.Mui-disabled': {
                bgcolor: alpha(theme.palette.primary.main, 0.3),
                color: alpha(theme.palette.common.white, 0.6),
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}