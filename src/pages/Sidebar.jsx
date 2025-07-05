// src/pages/Sidebar.jsx
import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add"; // Import AddIcon for the Create button

export default function Sidebar({
  groups,
  communities,
  friends,
  joinedGroup,
  joinedCommunity,
  onJoinGroup,
  onJoinCommunity,
  onCreateClick,
  onGroupClick,
  onCommunityClick,
  onShowAllGroups,
  onShowAllCommunities,
  onShowAllFriends,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        backgroundColor: "#222",
        borderRadius: 2,
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        color: "#fff",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Navigation
      </Typography>

      <Button
        fullWidth
        variant="text"
        startIcon={<GroupIcon />}
        sx={{ justifyContent: "flex-start", mb: 1, color: "#fff" }}
        onClick={onShowAllGroups} // Trigger overlay for all groups
      >
        Groups
      </Button>
      <Button
        fullWidth
        variant="text"
        startIcon={<PeopleIcon />}
        sx={{ justifyContent: "flex-start", mb: 1, color: "#fff" }}
        onClick={onShowAllCommunities} // Trigger overlay for all communities
      >
        Communities
      </Button>
      <Button
        fullWidth
        variant="text"
        startIcon={<PersonAddIcon />}
        sx={{ justifyContent: "flex-start", mb: 1, color: "#fff" }}
        onClick={onShowAllFriends} // Trigger overlay for all friends
      >
        Friends
      </Button>

      <Divider sx={{ my: 2, borderColor: "#555" }} />

      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Actions
      </Typography>

      <Button
        fullWidth
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          backgroundColor: "#2196f3",
          "&:hover": { backgroundColor: "#1976d2" },
          color: "#fff",
          mb: 1,
        }}
        onClick={onCreateClick} // This will open the CreateGroupCommunityModal
      >
        Create New
      </Button>

      {/* You can add more specific lists here if desired, or rely on the overlay */}
      {/* <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        My Groups
      </Typography>
      {groups.length > 0 ? (
        groups.map((group) => (
          <Box key={group.id} sx={{ mb: 0.5, cursor: 'pointer' }} onClick={() => onGroupClick(group)}>
            <Typography variant="body2">{group.name}</Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: "#ccc" }}>No groups joined.</Typography>
      )} */}

      {/* Add similar sections for My Communities and My Friends if needed */}
    </Box>
  );
}
