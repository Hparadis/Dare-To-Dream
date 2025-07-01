// src/pages/Workout.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SkillLevelVideoList from './SkillLevelVideoList';

const workoutVideos = {
  Beginner: [
    { title: 'Running Basics', url: 'https://www.example.com/workout/running.mp4' },
    { title: 'Warm-up Exercises', url: 'https://www.example.com/workout/warmup.mp4' },
  ],
  Intermediate: [
    { title: 'HIIT Session', url: 'https://www.example.com/workout/hiit.mp4' },
    { title: 'Strength Training', url: 'https://www.example.com/workout/strength.mp4' },
  ],
  Advanced: [
    { title: 'Crossfit Challenge', url: 'https://www.example.com/workout/crossfit.mp4' },
    { title: 'Marathon Prep', url: 'https://www.example.com/workout/marathon.mp4' },
  ],
};

export default function Workout({ onSelectVideo }) {
  const levels = Object.keys(workoutVideos);

  const handleSelectVideo = (title) => {
    for (const lvl of levels) {
      const found = workoutVideos[lvl].find((v) => v.title === title);
      if (found) {
        onSelectVideo(found.url, title);
        return;
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#fff', mb: 3, display: 'flex', alignItems: 'center' }}>
        <FitnessCenterIcon sx={{ mr: 1, color: '#f44336' }} /> Workout Videos
      </Typography>
      <SkillLevelVideoList
        categoryName="Workout"
        levels={levels}
        videosByLevel={workoutVideos}
        icon={FitnessCenterIcon}
        tabColor="#f44336" // Red tabs
        onSelectVideo={handleSelectVideo}
      />
    </Box>
  );
}
