// src/pages/ProgressHeader.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NoteIcon from '@mui/icons-material/Note';

export default function ProgressHeader({ isDesktop, onOverlaySelect }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOverlayClick = (option) => {
    onOverlaySelect(option);
    handleMenuClose();
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: '#333',
        boxShadow: 'none',
        borderBottom: '1px solid #333',
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
          Dare To Dream
        </Typography>
        {isDesktop && (
          <>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ border: '1px solid #333', borderRadius: 1 }}
            >
              <MoreVertIcon sx={{ color: '#fff' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#111',
                  color: '#fff',
                },
              }}
            >
              <MenuItem onClick={() => handleOverlayClick('Goals')}>
                <ListItemIcon>
                  <AssignmentIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                Goals
              </MenuItem>
              <MenuItem onClick={() => handleOverlayClick('Journal')}>
                <ListItemIcon>
                  <NoteIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                Journal
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
