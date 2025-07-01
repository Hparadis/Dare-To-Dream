// src/pages/GlassCard.jsx
import { styled, Paper } from '@mui/material';

const GlassCard = styled(Paper)(() => ({
  backgroundColor: '#0f2241',
  border: '1px solid #333',
  borderRadius: 5,
  padding: 16,
  color: '#fff',
  transition: 'transform 0.3s ease',
  '&:hover': { transform: 'scale(1.02)' },
}));

export default GlassCard;
