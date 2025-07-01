// src/components/SettingsOverlay.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import TermsAndPolicyDialog from "./TermsAndPolicyDialog"; // Will create this next

export default function SettingsOverlay({ isOpen, onClose }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDarkMode, setIsDarkMode] = useState(true); // Assuming dark mode by default for demo
  const [isTermsAndPolicyOpen, setTermsAndPolicyOpen] = useState(false);

  const handleThemeChange = (event) => {
    setIsDarkMode(event.target.checked);
    // In a real application, you would integrate this with a global theme context
    console.log("Theme changed to Dark Mode:", event.target.checked);
  };

  const handleOpenTermsAndPolicy = () => {
    setTermsAndPolicyOpen(true);
  };

  const handleCloseTermsAndPolicy = () => {
    setTermsAndPolicyOpen(false);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(25,25,25,0.9)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.37)",
            position: 'relative',
            overflow: 'hidden',
          },
        }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiDialog-paper': {
              width: isSmallScreen ? '95%' : '70%',
              maxHeight: '90%',
              overflowY: 'auto'
          }
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: theme.spacing(1),
            left: theme.spacing(1),
            color: '#fff',
            zIndex: 1,
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <DialogTitle sx={{ textAlign: "center", color: "#fff", pt: 4, pb: 2 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            Settings
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

          <Paper sx={{ background: "rgba(255,255,255,0.08)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.2)", boxShadow: 'none', p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>General</Typography>
            <Divider sx={{ mb: 2, borderColor: '#555' }} />
            <List>
              <ListItem disableGutters>
                <ListItemText primary={<Typography sx={{ color: '#fff' }}>Change Theme</Typography>} />
                <FormControlLabel
                  control={<Switch checked={isDarkMode} onChange={handleThemeChange} sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#03DAC6',
                      '&:hover': {
                        backgroundColor: 'rgba(3, 218, 198, 0.08)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#03DAC6',
                    },
                  }} />}
                  label={isDarkMode ? "Dark Mode" : "Light Mode"}
                  labelPlacement="start"
                  sx={{ color: '#aaa', m: 0 }}
                />
              </ListItem>
              <ListItem button onClick={handleOpenTermsAndPolicy} disableGutters>
                <ListItemText primary={<Typography sx={{ color: '#fff' }}>Terms and Policy</Typography>} />
              </ListItem>
              {/* Add more settings items here */}
            </List>
          </Paper>

          <Paper sx={{ background: "rgba(255,255,255,0.08)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.2)", boxShadow: 'none', p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Account</Typography>
            <Divider sx={{ mb: 2, borderColor: '#555' }} />
            <TableContainer>
              <Table size="small" aria-label="settings table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Setting</TableCell>
                    <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: '#ccc', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Email</TableCell>
                    <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>user@example.com</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#ccc', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Subscription</TableCell>
                    <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Free Tier</TableCell>
                  </TableRow>
                  {/* Add more rows as needed */}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

        </DialogContent>
      </Dialog>

      {/* Render Terms and Policy Dialog */}
      <TermsAndPolicyDialog
        isOpen={isTermsAndPolicyOpen}
        onClose={handleCloseTermsAndPolicy}
      />
    </>
  );
}