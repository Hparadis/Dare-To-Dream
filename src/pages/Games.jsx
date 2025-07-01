// src/pages/Games.jsx
import React, { useState } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const Games = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");

  const fetchGames = async () => {
    // Placeholder: simulate fetching games from a free game API.
    const sampleGames = [
      { id: 1, name: "Game One" },
      { id: 2, name: "Game Two" },
      { id: 3, name: "Game Three" },
    ];
    setGames(sampleGames);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Games</Typography>
      <Button variant="contained" onClick={fetchGames} sx={{ mb: 2 }}>
        Fetch Games
      </Button>
      <Box>
        {games.length > 0 && (
          <List>
            {games.map(game => (
              <ListItem key={game.id} button onClick={() => setSelectedGame(game.name)}>
                <ListItemText primary={game.name} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      {selectedGame && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="body1">Playing: {selectedGame}</Typography>
          <Typography variant="body2">
            Game mode: Single or Multi (streaming integration placeholder)
          </Typography>
          <Button variant="contained" sx={{ mt: 1 }}>Start Game</Button>
        </Paper>
      )}
    </Box>
  );
};

export default Games;
