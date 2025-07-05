import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tabs,
  Tab,
  Fab,
  Modal, // Keep Modal for BooksModal
  // Removed TextField, InputAdornment, Dialog, DialogContent, AppBar, Toolbar
  // as they are now handled within ProgressHeader or not needed here directly.
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// import MenuIcon from '@mui/icons-material/Menu'; // No longer used, can remove
import AddIcon from '@mui/icons-material/Add';
// import SearchIcon from '@mui/icons-material/Search'; // No longer used as it's in ProgressHeader
// import CloseIcon from '@mui/icons-material/Close';   // No longer used as it's in ProgressHeader

import ProgressHeader from './ProgressHeader';
import ProgressSidebar from './ProgressSidebar';
import GlassCard from './GlassCard';
import VideoDialog from './VideoDialog';

import Meditation from './Meditation';
import Workout from './Workout';
import Yoga from './Yoga';
import BooksModal from './BooksModal';

import { nodes, content } from "./ProgressData";
import tracker from '../tracker';
import GoalsTable from '../components/GoalsTable';
import Journal from '../components/Journal';
// import MoreVertIcon from '@mui/icons-material/MoreVert'; // No longer used as it's in ProgressHeader
import AssignmentIcon from '@mui/icons-material/Assignment';
import NoteIcon from '@mui/icons-material/Note';
import { useNavigate } from 'react-router-dom';

const tabTypes = ['Sell', 'Buy', 'Rent'];

export default function Progress() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [selected, setSelected] = useState('Meditation');
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  // This menuAnchor is specifically for the mobile MoreVert menu's dropdown
  const [menuAnchor, setMenuAnchor] = useState(null);
  const openMenu = Boolean(menuAnchor); // For mobile MoreVert menu
  const [modalOpen, setModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [overlayView, setOverlayView] = useState(null);
  const handleBackFromOverlay = () => {
    console.log('Progress: handleBackFromOverlay called. Setting overlayView to null.'); // <-- ADD THIS LOG
    setOverlayView(null); 
    setSelected('Meditation'); 
    setSelectedVideo(null); 
  };
  const navigate = useNavigate();
  const handleOverlaySelectFromHeader = (view) => {
    setOverlayView(view);
    console.log(`Overlay view set to: ${view}`);
  };
  const handleGoHome = () => {
    console.log('Progress: Navigating to Home (/).');
    navigate('/home'); // This will navigate to your Home route
    // You might also want to reset some Progress page-specific states here
    setOverlayView(null); // Ensure any open overlay is closed when navigating away
    setSelected('Meditation'); // Reset selected tab
  };


  // States for search functionality, now owned and managed here, passed to ProgressHeader
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  // Handlers for mobile MoreVert menu, owned and managed here, passed to ProgressHeader
  const handleMobileMoreVertMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMobileMoreVertMenuClose = () => {
    setMenuAnchor(null);
  };

  // This function is called by ProgressHeader for its desktop Goals/Journal menu items
  

  const handleSelect = (label) => {
    setOverlayView(null);
    setSelected(label);
    setSelectedVideo(null);
    handleFeatureClick(label);
  };

  const handleFeatureClick = (featureName) => {
    tracker.trackEvent('feature_clicked', { feature: featureName });
  };

  const handleVideoOpen = (video) => {
    setSelectedVideo(video);
    setVideoOpen(true);
  };

  const handleVideoClose = () => {
    setVideoOpen(false);
    setSelectedVideo(null);
  };

  const handleTabChange = (_, newValue) => setTabIndex(newValue);
  const openUploadModal = () => setModalOpen(true);
  const closeUploadModal = () => setModalOpen(false);

  // Search handlers, passed to ProgressHeader
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Add filtering logic here later if needed
  };

  const handleMobileSearchOpen = () => {
    setIsSearchDialogOpen(true);
  };

  const handleMobileSearchClose = () => {
    setIsSearchDialogOpen(false);
    setSearchTerm(''); // Clear search term when closing
  };

  // Handler for ProgressHeader title click - go back to "Home" (default view)
  const handleHeaderTitleClick = () => {
    setOverlayView(null);      // Hide any active overlay (Goals/Journal)
    setSelected('Meditation'); // Set to default section (your "Home" view)
    setSelectedVideo(null);    // Close any open video
    setSearchTerm('');         // Clear search
  };

  useEffect(() => {
    tracker.trackEvent('page_view', { page: 'Progress' });
  }, []);
  

  const renderContent = () => {
    // Styling: Updated GlassCard backgrounds and borders
    if (overlayView === 'Goals') {
      return (
        <GlassCard sx={{ background: '#222', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>Goals</Typography>
          <GoalsTable onBack={handleBackFromOverlay} />
        </GlassCard>
      );
    }

    if (overlayView === 'Journal') {
      return (
        <GlassCard sx={{ background: '#222', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>Journal</Typography>
          <Journal onBack={handleBackFromOverlay} />
        </GlassCard>
      );
    }

    switch (selected) {
      case 'Meditation':
        return <Meditation onSelectVideo={handleVideoOpen} />;
      case 'Workout':
        return <Workout onSelectVideo={handleVideoOpen} />;
      case 'Yoga':
        return <Yoga onSelectVideo={handleVideoOpen} />;
      case 'Books': {
        const bookData = {
          Sell: [
            {
              title: 'The Alchemist',
              author: 'Paulo Coelho',
              image: 'https://covers.openlibrary.org/b/id/8279256-L.jpg',
            },
            {
              title: 'Atomic Habits',
              author: 'James Clear',
              image: 'https://covers.openlibrary.org/b/id/10958330-L.jpg',
            },
          ],
          Buy: [
            {
              title: 'Deep Work',
              author: 'Cal Newport',
              image: 'https://covers.openlibrary.org/b/id/8671807-L.jpg',
            },
            {
              title: 'Start With Why',
              author: 'Simon Sinek',
              image: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
            },
          ],
          Rent: [
            {
              title: 'Sapiens',
              author: 'Yuval Noah Harari',
              image: 'https://covers.openlibrary.org/b/id/8231994-L.jpg',
            },
            {
              title: 'Can’t Hurt Me',
              author: 'David Goggins',
              image: 'https://covers.openlibrary.org/b/id/10559319-L.jpg',
            },
          ],
        };

        const currentBooks = bookData[tabTypes[tabIndex]];

        return (
          <GlassCard sx={{ background: '#222', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>Books Marketplace</Typography>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              sx={{
                mb: 2,
                '& .MuiTab-root': { color: '#ccc' },
                '& .Mui-selected': { color: '#fff !important' },
                '& .MuiTabs-indicator': { backgroundColor: '#fff' },
              }}
            >
              {tabTypes.map((type, idx) => (
                <Tab key={idx} label={type} />
              ))}
            </Tabs>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Fab
                color="primary"
                size="medium"
                aria-label="add"
                onClick={openUploadModal}
                sx={{
                  background: '#1976d2',
                  '&:hover': { background: '#1565c0' },
                  width: 40,
                  height: 40,
                  minHeight: 'auto',
                  boxShadow: 'none',
                }}
              >
                <AddIcon fontSize="small" />
              </Fab>
            </Box>
            <Grid container spacing={3}>
              {currentBooks.map((book, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      background: '#222',
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.2)',
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                    />
                    <Typography variant="subtitle1" sx={{ color: '#fff' }}>{book.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#aaa' }}>{book.author}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            {modalOpen && <BooksModal onClose={closeUploadModal} mode={tabTypes[tabIndex]} />}
          </GlassCard>
        );
      }
      default:
        return (
          <GlassCard sx={{ background: '#222', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>{selected}</Typography>
            <Grid container spacing={2}>
              {content[selected]?.map((item) => (
                <Grid item xs={6} sm={4} md={3} key={item}>
                  <Paper
                    onClick={() => handleVideoOpen(item)}
                    sx={{
                      p: 1.5,
                      textAlign: 'center',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 1,
                      background: '#222',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Typography sx={{ color: '#eee', fontWeight: 500, fontSize: '0.9rem' }}>{item}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </GlassCard>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#333', color: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* ProgressHeader component now handles all top-bar styling and content */}
      <ProgressHeader
        isDesktop={isDesktop}
        onOverlaySelect={handleOverlaySelectFromHeader} // For desktop Goals/Journal menu from header
        onTitleClick={handleGoHome} // For clicking the main header title
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        isSearchDialogOpen={isSearchDialogOpen}
        handleMobileSearchOpen={handleMobileSearchOpen}
        handleMobileSearchClose={handleMobileSearchClose}
        menuAnchor={menuAnchor} // For mobile MoreVert menu
        handleMenuOpen={handleMobileMoreVertMenuOpen} // For mobile MoreVert menu
        handleMenuClose={handleMobileMoreVertMenuClose} // For mobile MoreVert menu
      />

      {/* Mobile-only MoreVert Menu (Goals/Journal) - remains here as it's a dialog/menu for parent control */}
      {!isDesktop && (
          <Menu
              anchorEl={menuAnchor}
              open={openMenu}
              onClose={handleMobileMoreVertMenuClose}
              PaperProps={{ style: { backgroundColor: '#222', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 1 } }}
          >
              <MenuItem onClick={() => { setOverlayView('Goals'); handleMobileMoreVertMenuClose(); }}>
                  <ListItemIcon sx={{ color: '#fff', mr: 1 }}>
                      <AssignmentIcon />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ color: '#fff' }}>Goals</Typography>
              </MenuItem>
              <MenuItem onClick={() => { setOverlayView('Journal'); handleMobileMoreVertMenuClose(); }}>
                  <ListItemIcon sx={{ color: '#fff', mr: 1 }}>
                      <NoteIcon />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ color: '#fff' }}>Journal</Typography>
              </MenuItem>
          </Menu>
      )}

      <Box sx={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', flex: 1, p: isDesktop ? 3 : 1 }}>
        {!overlayView && (
          isDesktop ? (
            <ProgressSidebar nodes={nodes.filter((n) => n.label)} selected={selected} handleSelect={handleSelect} />
          ) : (
            // Mobile view for selected title - displayed below the main header
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>{selected}</Typography>
              {/* Mobile search icon and MoreVert are now in ProgressHeader */}
            </Box>
          )
        )}

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>{renderContent()}</Box>
      </Box>

      <VideoDialog videoOpen={videoOpen} toggleVideo={handleVideoClose} selectedVideo={selectedVideo} />
      {modalOpen && <BooksModal onClose={closeUploadModal} mode={tabTypes[tabIndex]} />}

      {/* Bottom Navigation for Mobile */}
      {!isDesktop && !overlayView && (
        <BottomNavigation
          value={selected}
          onChange={(event, newValue) => handleSelect(newValue)}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#333',
            boxShadow: '0px -5px 15px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
          showLabels
        >
          {nodes.filter((n) => n.label).map((n) => (
            <BottomNavigationAction
              key={n.label}
              label={n.displayLabel} // Use displayLabel for visual text
              value={n.label}
              icon={n.icon}
              sx={{ color: selected === n.label ? theme.palette.primary.main : '#ccc', '&.Mui-selected': { color: theme.palette.primary.main } }}
            />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
}