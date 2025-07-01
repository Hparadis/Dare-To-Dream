// src/pages/Yoga.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SkillLevelVideoList from './SkillLevelVideoList';

const yogaVideos = {
  Beginner: [
    { title: 'Hatha Yoga', url: 'https://www.example.com/yoga/hatha.mp4' },
    { title: 'Basic Stretching', url: 'https://www.example.com/yoga/basic-stretching.mp4' },
  ],
  Intermediate: [
    { title: 'Vinyasa Flow', url: 'https://www.example.com/yoga/vinyasa.mp4' },
    { title: 'Power Yoga', url: 'https://www.example.com/yoga/power.mp4' },
  ],
  Advanced: [
    { title: 'Restorative Yoga', url: 'https://www.example.com/yoga/restorative.mp4' },
    { title: 'Advanced Asanas', url: 'https://www.example.com/yoga/advanced-asanas.mp4' },
  ],
};

export default function Yoga({ onSelectVideo }) {
  const levels = Object.keys(yogaVideos);

  const handleSelectVideo = (title) => {
    for (const lvl of levels) {
      const found = yogaVideos[lvl].find((v) => v.title === title);
      if (found) {
        onSelectVideo(found.url, title);
        return;
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#fff', mb: 3, display: 'flex', alignItems: 'center' }}>
        <SelfImprovementIcon sx={{ mr: 1, color: '#4caf50' }} /> Yoga Videos
      </Typography>
      <SkillLevelVideoList
        categoryName="Yoga"
        levels={levels}
        videosByLevel={yogaVideos}
        icon={SelfImprovementIcon}
        tabColor="#4caf50" // Green tabs
        onSelectVideo={handleSelectVideo}
      />
    </Box>
  );
}
