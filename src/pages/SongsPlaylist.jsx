// src/pages/SongsPlaylist.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

const SongsPlaylist = () => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const handleSearch = async () => {
    // Placeholder: simulate a search result. Replace with an API call later.
    const sampleSongs = [
      { id: 1, title: "Song A" },
      { id: 2, title: "Song B" },
      { id: 3, title: "Song C" }
    ];
    setSongs(sampleSongs);
  };

  const handleAddToPlaylist = (song) => {
    setPlaylist(prev => [...prev, song]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Songs Playlist</Typography>
      <TextField
        fullWidth
        label="Search Songs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button variant="contained" onClick={handleSearch} sx={{ mt: 1 }}>Search</Button>
      <Box sx={{ my: 2 }}>
        {songs.length > 0 && (
          <List>
            {songs.map(song => (
              <ListItem key={song.id}>
                <ListItemText primary={song.title} />
                <Button variant="outlined" size="small" onClick={() => handleAddToPlaylist(song)}>
                  Add to Playlist
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Typography variant="h6" sx={{ mt: 2 }}>Your Playlist</Typography>
      {playlist.length > 0 ? (
        <List>
          {playlist.map((song, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={song.title} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No songs added yet.</Typography>
      )}
    </Box>
  );
};

export default SongsPlaylist;
