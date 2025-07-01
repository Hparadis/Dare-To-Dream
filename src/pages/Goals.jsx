// src/pages/Goals.jsx
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
  Checkbox,
  Paper,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GoalsTable from '../components/GoalsTable';
import { useNavigate } from 'react-router-dom';

export default function Goals() {
  const [goalTitle, setGoalTitle] = useState('');
  const [reminder, setReminder] = useState('');
  const [goals, setGoals] = useState([
    { id: 1, text: 'Practice meditation daily', completed: false },
    { id: 2, text: 'Read 10 pages every day', completed: true },
  ]);
  const [newGoal, setNewGoal] = useState('');
  const navigate = useNavigate();

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    setGoals((prev) => [
      ...prev,
      { id: Date.now(), text: newGoal.trim(), completed: false },
    ]);
    setNewGoal('');
  };

  const toggleComplete = (id) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddGoal();
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 4,
        maxWidth: 1000,
        mx: 'auto',
        color: '#eee',
      }}
    >
      {/* Title and Reminder */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Goal Title"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            variant="filled"
            InputProps={{ sx: { bgcolor: '#222', color: '#fff' } }}
            InputLabelProps={{ sx: { color: '#aaa' } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Reminder"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            variant="filled"
            InputProps={{ sx: { bgcolor: '#222', color: '#fff' } }}
            InputLabelProps={{ sx: { color: '#aaa' } }}
          />
        </Grid>
      </Grid>

      {/* SMART Table */}
      <GoalsTable />

      {/* Goal Checklist */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          My Goals
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            variant="filled"
            placeholder="Add new goal"
            fullWidth
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              sx: {
                backgroundColor: '#222',
                color: '#eee',
                '& .MuiInputBase-input': { color: '#eee' },
              },
            }}
          />
          <Button variant="contained" onClick={handleAddGoal}>
            Add
          </Button>
        </Box>

        <Paper
          sx={{
            maxHeight: 300,
            overflowY: 'auto',
            bgcolor: '#1e1e1e',
            borderRadius: 1,
            border: '1px solid #333',
          }}
        >
          <List>
            {goals.length === 0 && (
              <Typography
                sx={{ p: 2, color: '#888', textAlign: 'center' }}
                variant="body2"
              >
                No goals yet. Add one above!
              </Typography>
            )}
            {goals.map(({ id, text, completed }) => (
              <ListItem
                key={id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteGoal(id)}
                    sx={{ color: '#ff5555' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
                sx={{
                  px: 2,
                  py: 1,
                  borderBottom: '1px solid #333',
                  bgcolor: completed ? 'rgba(0, 150, 136, 0.3)' : 'transparent',
                }}
              >
                <Checkbox
                  checked={completed}
                  onChange={() => toggleComplete(id)}
                  sx={{
                    color: '#4db6ac',
                    '&.Mui-checked': { color: '#26a69a' },
                  }}
                />
                <ListItemText
                  primary={text}
                  sx={{
                    userSelect: 'none',
                    textDecoration: completed ? 'line-through' : 'none',
                    color: completed ? '#aaa' : '#eee',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Back Button */}
      <IconButton
        onClick={() => navigate('/progress')}
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          backgroundColor: '#fff',
          color: '#000',
          borderRadius: '50%',
          p: 1.5,
          boxShadow: 4,
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
}
