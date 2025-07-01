// src/pages/Progress.jsx
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
  Modal,
  Fade,
  Backdrop,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';

import ProgressHeader from './ProgressHeader';
import ProgressSidebar from './ProgressSidebar';
import GlassCard from './GlassCard';
import VideoDialog from './VideoDialog';

import Meditation from './Meditation';
import Workout from './Workout';
import Yoga from './Yoga';
import BooksModal from './BooksModal';

import { nodes, content, notificationData, historyData } from './ProgressData';
import tracker from '../tracker';
import GoalsTable from '../components/GoalsTable';
import Journal from '../components/Journal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NoteIcon from '@mui/icons-material/Note';


const tabTypes = ['Sell', 'Buy', 'Rent'];

export default function Progress() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [selected, setSelected] = useState('Meditation');
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [overlayView, setOverlayView] = useState(null); // 'Goals' | 'Journal' | null
  const [showGoals, setShowGoals] = useState(false);

  const handleOverlayMenu = (option) => setOverlayView(option);

  const openMenu = Boolean(menuAnchor);
  const handleOverlayClick = (option) => {
    setSelected(null);          // Hide section
    setSelectedVideo(null);     // Hide any video
    setOverlayView(option);     // Show overlay (Goals or Journal)
  };

  const handleSelect = (label) => {
    setOverlayView(null); // Hide overlay if any
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

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleTabChange = (_, newValue) => setTabIndex(newValue);
  const openUploadModal = () => setModalOpen(true);
  const closeUploadModal = () => setModalOpen(false);

  useEffect(() => {
    tracker.trackEvent('page_view', { page: 'Progress' });
  }, []);

  const renderContent = () => {
    if (overlayView === 'Goals') {
      return (
        <GlassCard sx={{ background: 'transparent', border: '1px solid #666', p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>Goals</Typography>
          <GoalsTable />
        </GlassCard>
      );
    }
  
    if (overlayView === 'Journal') {
      return (
        <GlassCard sx={{ background: 'transparent', border: '1px solid #666', p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>Journal</Typography>
          <Journal />
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
          <GlassCard sx={{ background: 'transparent', border: '1px solid #666', p: 2 }}>
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
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 2,
                      border: '1px solid #444',
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
      case 'Notifications':
        return (
          <GlassCard sx={{ background: 'transparent', border: '1px solid #666', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>Notifications</Typography>
            {notificationData.length === 0 ? (
              <Typography sx={{ color: '#fff' }}>No notifications yet.</Typography>
            ) : (
              notificationData.map((note, index) => (
                <Paper key={index} sx={{ p: 1, mb: 1, backgroundColor: '#222' }}>
                  <Typography sx={{ color: '#fff' }}>{note}</Typography>
                </Paper>
              ))
            )}
          </GlassCard>
        );
      case 'History':
        return (
          <GlassCard sx={{ background: 'transparent', border: '1px solid #666', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>History</Typography>
            {historyData.length === 0 ? (
              <Typography sx={{ color: '#fff' }}>No history logs yet.</Typography>
            ) : (
              historyData.map((log, index) => (
                <Paper key={index} sx={{ p: 1, mb: 1, backgroundColor: '#222' }}>
                  <Typography sx={{ color: '#fff' }}>{log}</Typography>
                </Paper>
              ))
            )}
          </GlassCard>
        );
      default:
        return (
          <GlassCard sx={{ background: 'transparent', border: '1px solid #666' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>{selected}</Typography>
            <Grid container spacing={2}>
              {content[selected]?.map((item) => (
                <Grid item xs={6} sm={4} md={3} key={item}>
                  <Paper
                    onClick={() => handleVideoOpen(item)}
                    sx={{
                      p: 1.5,
                      textAlign: 'center',
                      border: '1px solid #666',
                      borderRadius: 1,
                      background: 'rgba(255, 255, 255, 0.05)',
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
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0a0a0a, #222)', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <ProgressHeader isDesktop={isDesktop} onOverlaySelect={setOverlayView} />
      <Box sx={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', flex: 1, p: isDesktop ? 3 : 1 }}>
      {!overlayView && (
        isDesktop ? (
          <ProgressSidebar nodes={nodes.filter((n) => n.label)} selected={selected} handleSelect={handleSelect} />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>{selected}</Typography>
            <IconButton onClick={handleMenuOpen} sx={{ color: '#fff' }}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={openMenu}
              onClose={handleMenuClose}
              PaperProps={{ style: { backgroundColor: '#111', color: '#fff' } }}
            >
              <MenuItem onClick={() => { setOverlayView('Goals'); handleMenuClose(); }}>
                <ListItemIcon sx={{ color: '#fff', mr: 1 }}>
                  <AssignmentIcon />
                </ListItemIcon>
                <Typography variant="body2" sx={{ color: '#fff' }}>Goals</Typography>
              </MenuItem>
              <MenuItem onClick={() => { setOverlayView('Journal'); handleMenuClose(); }}>
                <ListItemIcon sx={{ color: '#fff', mr: 1 }}>
                  <NoteIcon />
                </ListItemIcon>
                <Typography variant="body2" sx={{ color: '#fff' }}>Journal</Typography>
              </MenuItem>
            </Menu>

          </Box>
        )
      )}

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>{renderContent()}</Box>
      </Box>
      <VideoDialog videoOpen={videoOpen} toggleVideo={handleVideoClose} selectedVideo={selectedVideo} />
      {!isDesktop && !overlayView && (
        <BottomNavigation
          value={selected}
          onChange={(event, newValue) => handleSelect(newValue)}
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1a1a1a', borderTop: '1px solid #333', zIndex: 1000 }}
          showLabels
        >
          {nodes.filter((n) => n.label).map((n) => (
            <BottomNavigationAction
              key={n.label}
              label={n.label}
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
