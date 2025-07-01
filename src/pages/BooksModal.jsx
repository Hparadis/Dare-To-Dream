import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const bookConditions = ['New', 'Like New', 'Used', 'Worn'];

export default function BooksModal({ onClose, mode = 'Upload' }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    condition: '',
    description: '',
    duration: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${mode} book:`, formData);
    onClose();
    setFormData({
      title: '',
      author: '',
      price: '',
      condition: '',
      description: '',
      duration: '',
    });
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 480,
        bgcolor: '#121212',
        border: '2px solid #666',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        color: '#fff',
        maxHeight: '90vh',
        overflowY: 'auto',
        maxWidth: 400,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{mode} a Book</Typography>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ style: { color: '#aaa' } }}
          InputProps={{ style: { color: '#fff' } }}
          size="small"
        />
        <TextField
          label="Author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ style: { color: '#aaa' } }}
          InputProps={{ style: { color: '#fff' } }}
          size="small"
        />

        {(mode === 'Sell' || mode === 'Rent') && (
          <>
            <TextField
              label="Price ($)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: '#aaa' } }}
              InputProps={{ style: { color: '#fff' } }}
              size="small"
            />
            <TextField
              label="Condition"
              name="condition"
              select
              value={formData.condition}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: '#aaa' } }}
              InputProps={{ style: { color: '#fff' } }}
              size="small"
            >
              {bookConditions.map((cond) => (
                <MenuItem key={cond} value={cond}>
                  {cond}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}

        {mode === 'Rent' && (
          <TextField
            label="Rent Duration (days)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ style: { color: '#aaa' } }}
            InputProps={{ style: { color: '#fff' } }}
            size="small"
          />
        )}

        {(mode === 'Buy' || mode === 'Sell') && (
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: '#aaa' } }}
            InputProps={{ style: { color: '#fff' } }}
            size="small"
          />
        )}

        {mode === 'Buy' && (
          <Typography variant="body2" color="gray" sx={{ mt: 1 }}>
            You can search and request books to buy here.
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={onClose} sx={{ mr: 2 }} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
