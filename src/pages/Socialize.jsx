// src/pages/Socialize.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Divider,
} from '@mui/material';

const Socialize = () => {
  const [selectedTab, setSelectedTab] = useState("Gifts");
  const [searchQuery, setSearchQuery] = useState("");
  const [gatewayDetails, setGatewayDetails] = useState({ name: "", email: "", password: "" });

  const renderGifts = () => (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          fullWidth
          label="Search Gifts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" sx={{ ml: 2 }}>Search</Button>
      </Box>
      <Typography variant="body1">Gift apps: Amazon, Walmart, Shopify, Alibaba (icons placeholder)</Typography>
    </Box>
  );

  const renderGateway = () => (
    <Box>
      <Typography variant="body1" sx={{ mb: 2 }}>Enter details to connect your account:</Typography>
      <TextField
        fullWidth
        label="Name"
        value={gatewayDetails.name}
        onChange={(e) => setGatewayDetails({ ...gatewayDetails, name: e.target.value })}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        value={gatewayDetails.email}
        onChange={(e) => setGatewayDetails({ ...gatewayDetails, email: e.target.value })}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={gatewayDetails.password}
        onChange={(e) => setGatewayDetails({ ...gatewayDetails, password: e.target.value })}
        sx={{ mb: 2 }}
      />
      <Button variant="contained">Invite Members</Button>
    </Box>
  );

  const renderVolunteer = () => (
    <Box>
      <Typography variant="body1" sx={{ mb: 2 }}>Volunteer Settings:</Typography>
      <Select fullWidth defaultValue="Public" sx={{ mb: 2 }}>
        <MenuItem value="Public">Public</MenuItem>
        <MenuItem value="Private">Private</MenuItem>
      </Select>
      <TextField
        fullWidth
        label="Additional Requirements"
        sx={{ mb: 2 }}
      />
      <Button variant="contained">Invite Volunteers</Button>
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Socialize</Typography>
      {/* Tab Navigation for Socialize Subfeatures */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant={selectedTab === "Gifts" ? "contained" : "outlined"}
          onClick={() => setSelectedTab("Gifts")}
        >
          Gifts
        </Button>
        <Button
          variant={selectedTab === "Gateway" ? "contained" : "outlined"}
          onClick={() => setSelectedTab("Gateway")}
        >
          Gateway
        </Button>
        <Button
          variant={selectedTab === "Camping" ? "contained" : "outlined"}
          onClick={() => setSelectedTab("Camping")}
        >
          Camping
        </Button>
        <Button
          variant={selectedTab === "Volunteer" ? "contained" : "outlined"}
          onClick={() => setSelectedTab("Volunteer")}
        >
          Volunteer
        </Button>
      </Box>
      <Divider sx={{ my: 2, bgcolor: "#fff" }} />
      {selectedTab === "Gifts" && renderGifts()}
      {(selectedTab === "Gateway" || selectedTab === "Camping") && renderGateway()}
      {selectedTab === "Volunteer" && renderVolunteer()}
    </Box>
  );
};

export default Socialize;
