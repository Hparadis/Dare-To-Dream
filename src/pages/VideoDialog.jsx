// src/pages/VideoDialog.jsx
import React, { forwardRef } from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function VideoDialog({
  videoOpen,
  toggleVideo,
  selected,
  selectedVideo,
  menuAnchor,
  openMenu,
  handleMenuOpen,
  handleMenuClose,
  nodes,
  handleSelect,
}) {
  const theme = useTheme();

  return (
    <Dialog
      fullScreen
      open={videoOpen}
      onClose={toggleVideo}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          backgroundColor: '#121212',
          color: '#fff',
        },
      }}
    >
      <AppBar
        sx={{
          position: 'relative',
          backgroundColor: '#1f1f1f',
          borderBottom: '1px solid #333',
          color: '#fff',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={toggleVideo}
            sx={{ border: '1px solid #333', borderRadius: 1, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flex: 1, color: '#fff' }}>
            {selected || '[Select a video]'}
          </Typography>
          <IconButton onClick={handleMenuOpen} sx={{ border: '1px solid #333', borderRadius: 1, color: '#fff' }}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={menuAnchor} open={openMenu} onClose={handleMenuClose}>
            {(nodes || []).map((n) => (
              <MenuItem
                key={n.label}
                onClick={() => handleSelect(n.label)}
                sx={{
                  border: '1px solid #333',
                  borderRadius: 2,
                  backgroundColor: '#222',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#333' },
                }}
              >
                {n.label}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          p: 4,
          height: 'calc(100% - 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#121212',
        }}
      >
        {selectedVideo ? (
          <video
            src={selectedVideo}
            controls
            autoPlay
            style={{
              width: '80%',
              maxHeight: '70vh',
              borderRadius: 8,
              backgroundColor: '#000',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
            }}
          />
        ) : (
          <Typography variant="h4" color="#888" sx={{ mt: 10 }}>
            Select a video to play
          </Typography>
        )}

        {/* Placeholder for step by step instructions */}
        {selectedVideo && (
          <Box
            sx={{
              mt: 4,
              width: '80%',
              maxWidth: 700,
              p: 3,
              backgroundColor: '#222',
              borderRadius: 2,
              color: '#eee',
              textAlign: 'left',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Step-by-step Instructions
            </Typography>
            <Typography sx={{ mb: 1 }}>1. Prepare your space.</Typography>
            <Typography sx={{ mb: 1 }}>2. Follow the video carefully.</Typography>
            <Typography sx={{ mb: 1 }}>3. Practice regularly.</Typography>
            <Typography>4. Reflect on your progress.</Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
