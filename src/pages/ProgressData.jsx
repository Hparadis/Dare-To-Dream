// src/pages/ProgressData.jsx
import SpaIcon from '@mui/icons-material/Spa';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

// Sidebar navigation nodes, including Notifications and History
export const nodes = [
  { label: 'Meditation', displayLabel: '', icon: <SpaIcon sx={{ color: '#fff' }} /> },
  { label: 'Books', displayLabel: '', icon: <MenuBookIcon sx={{ color: '#fff' }} /> },
  { label: 'Workout', displayLabel: '', icon: <FitnessCenterIcon sx={{ color: '#fff' }} /> },
  { label: 'Yoga', displayLabel: '', icon: <SelfImprovementIcon sx={{ color: '#fff' }} /> },
];

// Content mapping per section
export const content = {
  Meditation: ['Guided Meditation', 'Mindfulness Practices', 'Transcendental Techniques', 'Vipassana Insight'],
  Books: ['Bestsellers', 'New Releases', 'Fiction', 'Non-Fiction', 'e-Books'],
  Workout: ['Cardio', 'Strength Training', 'HIIT Sessions', 'Running Plans'],
  Yoga: ['Hatha Yoga', 'Vinyasa Flow', 'Restorative Yoga', 'Ashtanga Series'],
};
