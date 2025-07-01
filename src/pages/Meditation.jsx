// src/pages/Meditation.jsx
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa'; // Meditation icon
import SkillLevelVideoList from './SkillLevelVideoList'; // The generic list component we designed

// Meditation videos grouped by skill level, with more types added as example
const meditationVideos = {
  Beginner: [
    { title: 'Guided Meditation', url: 'https://www.example.com/meditation/guided.mp4' },
    { title: 'Mindfulness', url: 'https://www.example.com/meditation/mindfulness.mp4' },
    { title: 'Breathing Basics', url: 'https://www.example.com/meditation/breathing-basics.mp4' },
  ],
  Intermediate: [
    { title: 'Transcendental', url: 'https://www.example.com/meditation/transcendental.mp4' },
    { title: 'Vipassana', url: 'https://www.example.com/meditation/vipassana.mp4' },
    { title: 'Body Scan Meditation', url: 'https://www.example.com/meditation/body-scan.mp4' },
  ],
  Advanced: [
    { title: 'Loving Kindness Meditation', url: 'https://www.example.com/meditation/loving-kindness.mp4' },
    { title: 'Chakra Meditation', url: 'https://www.example.com/meditation/chakra.mp4' },
    { title: 'Advanced Visualization', url: 'https://www.example.com/meditation/advanced-visualization.mp4' },
  ],
};

export default function Meditation({ onSelectVideo }) {
  const levels = Object.keys(meditationVideos);

  // Wrap onSelectVideo so it can receive url instead of title
  const handleSelectVideo = (title) => {
    // Find the video url by title from all levels (simplified)
    for (const lvl of levels) {
      const found = meditationVideos[lvl].find((v) => v.title === title);
      if (found) {
        onSelectVideo(found.url, title);
        return;
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#fff', mb: 3, display: 'flex', alignItems: 'center' }}>
        <SpaIcon sx={{ mr: 1 }} /> Meditation Videos
      </Typography>
      <SkillLevelVideoList
        categoryName="Meditation"
        levels={levels}
        videosByLevel={meditationVideos}
        icon={SpaIcon}
        onSelectVideo={handleSelectVideo}
      />
    </Box>
  );
}
