import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FriendAccordion = ({ friend, onAdd }) => {
  return (
    <Accordion sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
        <ListItem disablePadding>
          <ListItemAvatar>
            <Avatar src={friend.image} />
          </ListItemAvatar>
          <ListItemText primary={friend.name} />
        </ListItem>
      </AccordionSummary>
      <AccordionDetails>
        <div>{friend.description}</div>
        <Button variant="contained" size="small" sx={{ mt: 1 }} onClick={() => onAdd(friend)}>
          Add
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default FriendAccordion;
