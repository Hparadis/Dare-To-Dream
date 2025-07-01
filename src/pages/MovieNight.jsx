// src/pages/MovieNight.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const MovieNight = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [uploadedMovie, setUploadedMovie] = useState(null);

  const handleSearch = async () => {
    // Example using the OMDB API – replace YOUR_API_KEY with your actual API key.
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=YOUR_API_KEY`);
    const data = await response.json();
    if (data?.Search) {
      setMovies(data.Search);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedMovie(URL.createObjectURL(file));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Movie Night</Typography>
      <TextField
        fullWidth
        label="Search Movies"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button variant="contained" onClick={handleSearch} sx={{ mt: 1 }}>Search</Button>
      <Box sx={{ my: 2 }}>
        {movies.length > 0 && (
          <List>
            {movies.map(movie => (
              <ListItem key={movie.imdbID}>
                <ListItemText primary={movie.Title} secondary={movie.Year} />
                <Button variant="outlined" size="small">Invite</Button>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Button variant="outlined" component="label">
        Upload Movie from Device
        <input type="file" hidden onChange={handleUpload} />
      </Button>
      {uploadedMovie && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="body1">Movie Preview</Typography>
          <video src={uploadedMovie} controls width="100%" />
          <Button variant="contained" sx={{ mt: 1 }}>Invite Friends</Button>
        </Paper>
      )}
    </Box>
  );
};

export default MovieNight;
