// src/pages/ProgressData.jsx
import SpaIcon from '@mui/icons-material/Spa';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryIcon from '@mui/icons-material/History';

// Sidebar navigation nodes, including Notifications and History
export const nodes = [
  { label: 'Meditation', icon: <SpaIcon sx={{ color: '#fff' }} /> },
  { label: 'Books', icon: <MenuBookIcon sx={{ color: '#fff' }} /> },
  { label: 'Workout', icon: <FitnessCenterIcon sx={{ color: '#fff' }} /> },
  { label: 'Yoga', icon: <SelfImprovementIcon sx={{ color: '#fff' }} /> },
  { label: 'Notifications', icon: <NotificationsIcon sx={{ color: '#fca5a5' }} /> },
  { label: 'History', icon: <HistoryIcon sx={{ color: '#cbd5e1' }} /> },
];

// Content mapping per section
export const content = {
  Meditation: ['Guided Meditation', 'Mindfulness Practices', 'Transcendental Techniques', 'Vipassana Insight'],
  Books: ['Bestsellers', 'New Releases', 'Fiction', 'Non-Fiction', 'e-Books'],
  Workout: ['Cardio', 'Strength Training', 'HIIT Sessions', 'Running Plans'],
  Yoga: ['Hatha Yoga', 'Vinyasa Flow', 'Restorative Yoga', 'Ashtanga Series'],
  Notifications: [], // Placeholder for future notification items
  History: [], // Placeholder for future history items
};

// Prepared empty notification and history for future data injection
export const notificationData = []; // All notifications will be pushed here
export const historyData = []; // All history logs will be stored here
