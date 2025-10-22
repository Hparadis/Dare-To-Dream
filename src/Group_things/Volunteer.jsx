// src/Group_things/Volunteer.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Volunteer = ({ groupId, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [members, setMembers] = useState([]);
  const [things, setThings] = useState(["ID card", "Water bottle"]);

  const handleSearch = () => {
    setResults([
      {
        id: 1,
        name: "Green Earth NGO",
        type: "NGO",
        conditions: "Open to all volunteers",
      },
      {
        id: 2,
        name: "City Hospital Support",
        type: "Public",
        conditions: "Requires health check",
      },
    ]);
  };

  const addThing = () => setThings([...things, ""]);
  const updateThing = (i, v) => {
    const copy = [...things];
    copy[i] = v;
    setThings(copy);
  };

  return (
    <Box sx={{ p: 3, color: "#fff" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Volunteer Opportunities
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search places to volunteer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, bgcolor: "#fff", borderRadius: 1 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <List sx={{ bgcolor: "#222", borderRadius: 2, mb: 3 }}>
        {results.map((place) => (
          <React.Fragment key={place.id}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ color: "#fff" }}>
                    {place.name}
                  </Typography>
                }
                secondary={`Type: ${place.type} — ${place.conditions}`}
              />
            </ListItem>
            <Divider sx={{ bgcolor: "#444" }} />
          </React.Fragment>
        ))}
      </List>

      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        Members Interested
      </Typography>
      <List sx={{ bgcolor: "#222", borderRadius: 2, mb: 3 }}>
        {members.length === 0 ? (
          <ListItem>
            <ListItemText primary="No members yet." />
          </ListItem>
        ) : (
          members.map((m, i) => (
            <ListItem key={i}>
              <ListItemText primary={m.name} />
            </ListItem>
          ))
        )}
      </List>

      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        Things to Remember
      </Typography>
      <List sx={{ bgcolor: "#222", borderRadius: 2 }}>
        {things.map((t, i) => (
          <ListItem key={i}>
            <TextField
              value={t}
              onChange={(e) => updateThing(i, e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#fff", borderRadius: 1 }}
            />
          </ListItem>
        ))}
      </List>
      <Button
        onClick={addThing}
        variant="outlined"
        sx={{ mt: 2, borderColor: "#fff", color: "#fff" }}
      >
        + Add Item
      </Button>
    </Box>
  );
};

export default Volunteer;
