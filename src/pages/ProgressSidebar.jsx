// src/pages/ProgressSidebar.jsx
import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

export default function ProgressSidebar({ nodes, selected, handleSelect }) {
  return (
    <Box
      sx={{
        width: 240,
        p: 2,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 2,
        border: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#eee', fontWeight: 500 }}>
        Explore
      </Typography>
      <List>
        {nodes.map((n) => (
          <ListItem disablePadding key={n.label} sx={{ mb: 0.5, borderRadius: 1 }}>
            <ListItemButton
              selected={selected === n.label}
              onClick={() => handleSelect(n.label)}
              sx={{
                borderRadius: 1,
                background: selected === n.label ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#eee', minWidth: 36 }}>{n.icon}</ListItemIcon>
              <ListItemText
                primary={n.label}
                primaryTypographyProps={{ color: '#eee', fontWeight: 400 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}