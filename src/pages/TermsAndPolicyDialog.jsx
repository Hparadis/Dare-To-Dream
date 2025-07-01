// src/components/TermsAndPolicyDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function TermsAndPolicyDialog({ isOpen, onClose }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(25,25,25,0.95)", // Slightly darker for this sub-overlay
          backdropFilter: "blur(15px)",
          color: "#fff",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)",
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
            width: isSmallScreen ? '95%' : '80%',
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
          right: theme.spacing(1), // Close icon on the right
          color: '#fff',
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle sx={{ textAlign: "center", color: "#fff", pt: 4, pb: 2 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          Terms and Policy
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'justify' }}>
        <Typography variant="body1" sx={{ mb: 2, color: '#ccc' }}>
          Welcome to Dare To Dream! These terms and policies ("Terms") govern your use of our application. By accessing or using Dare To Dream, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our application.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>1. Use of the Application</Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#aaa' }}>
          Dare To Dream provides a platform for users to connect, share experiences, and track personal growth. You agree to use the application only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the application. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within Dare To Dream.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>2. User Content</Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#aaa' }}>
          You retain all rights in, and are solely responsible for, the content you post to Dare To Dream. By posting content, you grant Dare To Dream a non-exclusive, royalty-free, transferable, sub-licensable, worldwide license to use, store, display, reproduce, modify, create derivative works, perform, and distribute your content on Dare To Dream solely for the purposes of operating, developing, providing, and using the Dare To Dream Products.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>3. Privacy Policy</Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#aaa' }}>
          Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using Dare To Dream, you agree to the collection and use of information in accordance with our Privacy Policy.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic', color: '#888' }}>
          This is a placeholder document. Full terms and conditions will be provided upon official launch.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}