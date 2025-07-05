// src/theme.js (Example)
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: '#4db6ac', // Teal-ish color for primary actions/highlights
      light: '#80cbc4',
      dark: '#00897b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffab40', // Orange-ish for secondary actions
      light: '#ffd97b',
      dark: '#c77c00',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef5350', // Red for errors/delete
      light: '#ff867c',
    },
    info: {
      main: '#29b6f6', // Light blue for info/edit
      light: '#73e8ff',
    },
    background: {
      default: '#1a1a1a', // Dark background for the app
      paper: '#222222', // Slightly lighter dark for cards/dialogs
    },
    text: {
      primary: '#fff', // Light text on dark backgrounds
      secondary: '#aaaaaa', // Muted text
      disabled: '#666666',
    },
  },
  typography: {
    fontFamily: ['"Inter"', 'sans-serif'].join(','),
    h5: {
      fontSize: '1.75rem', // Slightly larger title
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 8, // Slightly more rounded corners globally
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase buttons by default
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // Default input field overrides
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#2e2e2e', // Default paper background if not overridden
        },
      },
    },
    // You might want to define custom scrollbar styles here too if not inline
  },
});

export default theme;