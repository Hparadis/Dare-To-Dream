import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  Fab,
  Modal,
  Fade,
  Backdrop,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BooksModal from './BooksModal';

const tabTypes = ['Sell', 'Buy', 'Rent'];

export default function Books() {
  const [tabIndex, setTabIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [rentOpen, setRentOpen] = useState(false);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);
  const openUploadModal = () => setModalOpen(true);
  const closeUploadModal = () => setModalOpen(false);

  return (
    <Box sx={{ color: '#fff' }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#fff' }}>
        Books Marketplace
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        sx={{
          mb: 2,
          '& .MuiTab-root': {
            color: '#ccc',
          },
          '& .Mui-selected': {
            color: '#fff !important',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#fff',
          },
        }}
      >
        {tabTypes.map((type, idx) => (
          <Tab
            key={idx}
            label={type}
            sx={{
              color: '#ccc',
              '&.Mui-selected': {
                color: '#fff !important',
              },
            }}
          />
        ))}
      </Tabs>

      <Box sx={{ background: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 2 }}>
        <Typography variant="body1" sx={{ color: '#ddd' }}>
          {tabTypes[tabIndex]} books will appear here...
        </Typography>
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        onClick={openUploadModal}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 24,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>

      <Modal
        open={modalOpen}
        onClose={closeUploadModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={modalOpen}>
          <BooksModal onClose={closeUploadModal} type="Upload" />
        </Fade>
      </Modal>

      <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
        <Button variant="outlined" color="primary" onClick={() => setSellOpen(true)}>Sell Book</Button>
        <Button variant="outlined" color="primary" onClick={() => setBuyOpen(true)}>Buy Book</Button>
        <Button variant="outlined" color="primary" onClick={() => setRentOpen(true)}>Rent Book</Button>
      </Box>

      <BooksModal open={sellOpen} onClose={() => setSellOpen(false)} mode="Sell" />
      <BooksModal open={buyOpen} onClose={() => setBuyOpen(false)} mode="Buy" />
      <BooksModal open={rentOpen} onClose={() => setRentOpen(false)} mode="Rent" />
    </Box>
  );
}