// src/pages/Party.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const Party = () => {
  const [locationQuery, setLocationQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  const handleLocationSearch = async () => {
    // Placeholder: simulate location search using a free API such as Nominatim.
    const sampleLocations = [
      { id: 1, name: "Central Park" },
      { id: 2, name: "Times Square" },
      { id: 3, name: "Brooklyn Bridge" }
    ];
    setLocations(sampleLocations);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Party</Typography>
      <TextField
        fullWidth
        label="Search for a location"
        value={locationQuery}
        onChange={(e) => setLocationQuery(e.target.value)}
      />
      <Button variant="contained" onClick={handleLocationSearch} sx={{ mt: 1 }}>
        Search Location
      </Button>
      <Box sx={{ my: 2 }}>
        {locations.length > 0 && (
          <List>
            {locations.map(loc => (
              <ListItem key={loc.id} button onClick={() => setSelectedLocation(loc.name)}>
                <ListItemText primary={loc.name} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      {selectedLocation && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="body1">Selected Location: {selectedLocation}</Typography>
          <TextField
            fullWidth
            label="Enter invite message"
            value={inviteMessage}
            onChange={(e) => setInviteMessage(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button variant="contained" sx={{ mt: 1 }}>Send Invite</Button>
        </Paper>
      )}
    </Box>
  );
};

export default Party;
