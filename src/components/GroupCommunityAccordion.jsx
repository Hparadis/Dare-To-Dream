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

const GroupCommunityAccordion = ({ item, onJoin }) => {
  return (
    <Accordion sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
        <ListItem disablePadding>
          <ListItemAvatar>
            <Avatar src={item.image} />
          </ListItemAvatar>
          <ListItemText primary={item.name} />
        </ListItem>
      </AccordionSummary>
      <AccordionDetails>
        <div>{item.description}</div>
        <Button variant="contained" size="small" sx={{ mt: 1 }} onClick={() => onJoin(item)}>
          Join
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default GroupCommunityAccordion;
