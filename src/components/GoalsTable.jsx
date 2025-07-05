import React, { useRef, useState } from 'react';
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
  Typography,
  InputAdornment, // Added for date picker icon
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import { useNavigate } from 'react-router-dom';

// Date Picker Imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; // Import dayjs

const smart = ['Specific', 'Measurable', 'Achievable', 'Relevant', 'Time-bound'];
const questions = ['Who', 'What', 'When', 'Where', 'Why', 'How'];

export default function GoalsTable({ onBack }) {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const inputRefs = useRef({});
  // const navigate = useNavigate();

  // State for Goal Title and Due Date
  const [goalTitle, setGoalTitle] = useState('');
  const [dueDate, setDueDate] = useState(null); // dayjs object

  const clearTableInputs = () => {
    Object.values(inputRefs.current).forEach((ref) => {
      if (ref) ref.value = '';
    });
    setGoalTitle('');
    setDueDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}> {/* Wrap with LocalizationProvider */}
      <Box
        sx={{
          mt: 4,
          position: 'relative',
          maxWidth: 900,
          mx: 'auto',
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: 2,
          color: '#eee',
          // Ensure it fits smaller screens
          width: '100%', // Take full width available within its parent
          boxSizing: 'border-box', // Include padding in width calculation
        }}
      >
        {/* Back Arrow Button */}
        <IconButton
        
        onClick={() => {
          console.log('GoalsTable: Back button clicked! Calling onBack prop.'); // <-- ADD THIS LOG
          onBack(); 
        }} 
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 16 },
            left: { xs: 8, sm: 16 },
            color: '#fff',
            zIndex: 1,
            p: { xs: 0.5, sm: 1 },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 'bold',
            textAlign: 'center',
            mt: { xs: 4, sm: 5, md: 6 },
          }}
        >
          Goals Planning Table
        </Typography>

        {/* Goal Title and Date Picker */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isSmallScreen ? 'column' : 'row', // Stack vertically on small screens
            gap: 2,
            alignItems: isSmallScreen ? 'stretch' : 'center', // Stretch on small screens
            mb: 2,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            label="Goal Title"
            variant="filled"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            sx={{
              flexGrow: 1,
              backgroundColor: '#222',
              input: { color: '#fff' },
              label: { color: '#aaa' },
              // Ensure full width on small screens
              width: isSmallScreen ? '100%' : 'auto',
            }}
          />
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                sx={{
                  backgroundColor: '#222',
                  input: { color: '#fff' },
                  label: { color: '#aaa' },
                  // Ensure full width on small screens
                  width: isSmallScreen ? '100%' : 'auto',
                  '& .MuiInputAdornment-root .MuiIconButton-root': {
                    color: '#ccc', // Color for the calendar icon
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <CalendarTodayIcon sx={{ color: '#ccc' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>

        {/* Responsive Table Content */}
        {isSmallScreen ? (
          // Column Layout for Small Screens
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {smart.map((smartItem, smartIndex) => (
              <Paper
                key={smartItem}
                sx={{
                  backgroundColor: '#1e1e1e',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #444',
                }}
              >
                <Typography variant="subtitle1" sx={{ color: '#fff', mb: 1, fontWeight: 'bold' }}>
                  {smartItem}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {questions.map((question, questionIndex) => {
                    const key = `${smartIndex}-${questionIndex}`;
                    return (
                      <Box key={key}>
                        <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
                          {question}:
                        </Typography>
                        <input
                          ref={(el) => (inputRefs.current[key] = el)}
                          placeholder="Type..."
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: '#333',
                            border: '1px solid #444',
                            color: '#fff',
                            borderRadius: 4,
                            fontSize: '0.9rem',
                            boxSizing: 'border-box', // Include padding in width
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          // Row-Column Table for Larger Screens
          <Paper
            sx={{
              overflowX: 'auto', // Allows horizontal scrolling if content is too wide
              backgroundColor: '#1e1e1e',
              p: 2,
              borderRadius: 2,
            }}
          >
            <Table size="medium"> {/* size can be 'small' or 'medium' */}
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
        )}
      </Box>
    </LocalizationProvider>
  );
}