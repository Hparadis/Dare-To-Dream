import React, { useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  Box,
  TextField,
  IconButton,
  Typography, // Added Typography for the title
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router-dom';

const smart = ['Specific', 'Measurable', 'Achievable', 'Relevant', 'Time-bound'];
const questions = ['Who', 'What', 'When', 'Where', 'Why', 'How'];

export default function GoalsTable() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const inputRefs = useRef({});
  const navigate = useNavigate(); // This hook is correctly used for navigation

  const clearTableInputs = () => {
    Object.values(inputRefs.current).forEach((ref) => {
      if (ref) ref.value = '';
    });
  };

  return (
    <Box
      sx={{
        mt: 4, // Margin top for the entire component
        position: 'relative', // Crucial for positioning the absolute IconButton
        maxWidth: 900, // Max width for content readability on large screens
        mx: 'auto', // Center the content
        p: { xs: 2, sm: 3, md: 4 }, // Responsive padding around content
        bgcolor: 'rgba(255,255,255,0.05)', // Consistent background
        borderRadius: 2, // Consistent border radius
        color: '#eee', // Consistent text color
      }}
    >
      {/* Back Arrow Button - Placed at the top left */}
      <IconButton
        onClick={() => {
          console.log('Back button clicked! Navigating to /progress');
          navigate('/progress'); // This will trigger the navigation
        }}
        sx={{
          position: 'absolute', // Absolute positioning relative to the parent Box
          top: { xs: 8, sm: 16 }, // Adjusted top position
          left: { xs: 8, sm: 16 }, // Adjusted left position
          color: '#fff', // White arrow color
          zIndex: 1, // Ensure it's above other content
          // Removed specific background/boxShadow for a cleaner look,
          // allowing the parent's background to show through.
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Title - Add a title and give it some top margin to clear the arrow */}
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 'bold',
          textAlign: 'center',
          mt: { xs: 4, sm: 5, md: 6 }, // Add top margin to create space below the arrow
        }}
      >
        Goals Planning Table
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Goal Title"
          variant="filled"
          sx={{
            flexGrow: 1,
            backgroundColor: '#222',
            input: { color: '#fff' },
            label: { color: '#aaa' },
          }}
        />
        <IconButton sx={{ color: '#ccc' }}>
          <CalendarTodayIcon />
        </IconButton>
      </Box>

      <Paper
        sx={{
          overflowX: 'auto',
          backgroundColor: '#1e1e1e',
          p: 2,
          borderRadius: 2,
        }}
      >
        <Table size={isSmallScreen ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#ccc', minWidth: 100 }}>SMART</TableCell>
              {questions.map((q) => (
                <TableCell key={q} sx={{ color: '#ccc', minWidth: 100 }}>
                  {q}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {smart.map((item, i) => (
              <TableRow key={item}>
                <TableCell sx={{ color: '#fff' }}>{item}</TableCell>
                {questions.map((q, j) => {
                  const key = `${i}-${j}`;
                  return (
                    <TableCell key={q}>
                      <input
                        ref={(el) => (inputRefs.current[key] = el)}
                        placeholder="Type..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          background: '#333',
                          border: '1px solid #444',
                          color: '#fff',
                          borderRadius: 4,
                          fontSize: '0.9rem',
                        }}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Removed the extra Box with justifyContent: 'flex-start' and the duplicate IconButton */}
      {/* The single IconButton at the top handles the back functionality now */}
    </Box>
  );
}