import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  TextField,
  InputAdornment,
  Box,
  Dialog,
  DialogContent,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NoteIcon from '@mui/icons-material/Note';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

// ProgressHeader now takes props for search and mobile menu management
export default function ProgressHeader({
  isDesktop,
  onOverlaySelect, // For desktop Goals/Journal menu via onTitleClick
  onTitleClick,    // For clicking the main header title
  // Props for search functionality (managed by parent, passed down)
  searchTerm,
  handleSearchChange,
  isSearchDialogOpen,
  handleMobileSearchOpen,
  handleMobileSearchClose,
  // Props for mobile MoreVert menu (managed by parent, passed down)
  menuAnchor,       // For mobile MoreVert menu's anchor
  handleMenuOpen,   // For opening mobile MoreVert menu
  handleMenuClose,  // For closing mobile MoreVert menu
}) {
  // Local state for the desktop MoreVert menu only
  const [desktopMenuAnchor, setDesktopMenuAnchor] = useState(null);
  const openDesktopMenu = Boolean(desktopMenuAnchor);

  const handleDesktopMenuOpen = (event) => {
    setDesktopMenuAnchor(event.currentTarget);
  };

  const handleDesktopMenuClose = () => {
    setDesktopMenuAnchor(null);
  };

  const handleOverlayClick = (option) => {
    onOverlaySelect(option); // Calls parent's onOverlaySelect
    handleDesktopMenuClose(); // Close desktop menu
    if (!isDesktop) {
      // If on mobile, also ensure the main mobile menu is closed if it's open
      handleMenuClose();
    }
  };

  return (
    <AppBar
      position="static" // Stays in the normal document flow
      sx={{
        background: '#333', // Consistent background color
        boxShadow: 'none', // Remove default AppBar shadow
        border: '1px solid rgba(255,255,255,0.2)', // Border on all sides
        borderRadius: 5, // Consistent border-radius
        margin: 2, // Margin to make border-radius visible and space from edges
        width: 'calc(100% - 32px)', // Adjust width to account for 2*margin (2*16px = 32px)
        boxSizing: 'border-box', // Ensure padding/border are included in width
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            cursor: 'pointer', // Indicate it's clickable
            '&:hover': { opacity: 0.8 }, // Simple hover effect
            flexShrink: 0, // Prevent text from shrinking too much
          }}
          onClick={onTitleClick} // This handler goes back to "Home" (default section)
        >
          Progress
        </Typography>

        {isDesktop ? (
          <>
            {/* Desktop Search Bar */}
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                ml: 3, // Margin left from title
                flexGrow: 1, // Allows it to take available space
                maxWidth: '400px', // Max width for desktop search field
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#fff',
                  padding: '8px 12px',
                },
                '& .MuiInputAdornment-root': {
                  color: '#ccc',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#ccc' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Desktop MoreVert Menu for Goals/Journal */}
            <IconButton
              onClick={handleDesktopMenuOpen} // Use local state for desktop menu
              sx={{
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 1,
                color: '#fff',
                ml: 2, // Margin left from search bar
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={desktopMenuAnchor}
              open={openDesktopMenu}
              onClose={handleDesktopMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#222',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 1,
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
        ) : (
          // Mobile Menu/Search Icons
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <IconButton onClick={handleMobileSearchOpen} sx={{ color: '#fff', mr: 1 }}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={handleMenuOpen} sx={{ color: '#fff' }}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>

      {/* Mobile Search Dialog - Rendered here as it's part of the header's responsibility */}
      <Dialog open={isSearchDialogOpen} onClose={handleMobileSearchClose} fullScreen={!isDesktop} maxWidth="sm" fullWidth>
        <AppBar sx={{ position: 'relative', background: '#333' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleMobileSearchClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <TextField
              autoFocus
              fullWidth
              placeholder="Search..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                ml: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  borderRadius: '25px',
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputAdornment-root': { color: '#ccc' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#ccc' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ background: '#1a1a1a', py: 3 }}>
          <Typography variant="body1" sx={{ color: '#aaa', textAlign: 'center' }}>
            Type to search content...
          </Typography>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
}