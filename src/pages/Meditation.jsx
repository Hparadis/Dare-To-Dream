// src/pages/Meditation.jsx
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa'; // Meditation icon
import SkillLevelVideoList from './SkillLevelVideoList'; // The generic list component we designed

// Meditation videos grouped by skill level, with more types added as example
const meditationVideos = {
  Beginner: [
    { title: 'Mindfulness meditation', url: 'https://www.example.com/meditation/mindfulness.mp4' },
    { title: 'Vipassana', url: 'https://www.example.com/meditation/vipassana.mp4' },
    { title: 'Noting meditation', url: 'https://www.example.com/meditation/noting.mp4' },
    { title: 'Breath awareness', url: 'https://www.example.com/meditation/breath-awareness.mp4' },
    { title: 'Mantra meditation', url: 'https://www.example.com/meditation/mantra.mp4' },
    { title: 'Trataka (candle gazing)', url: 'https://www.example.com/meditation/trataka.mp4' },
    { title: 'Visualization meditation', url: 'https://www.example.com/meditation/visualization.mp4' },
    { title: 'Single-pointed concentration', url: 'https://www.example.com/meditation/concentration.mp4' },
    { title: 'Zen (Zazen)', url: 'https://www.example.com/meditation/zen.mp4' },
    { title: 'Taoist meditation', url: 'https://www.example.com/meditation/taoist.mp4' },
    { title: 'Walking meditation', url: 'https://www.example.com/meditation/walking.mp4' },
    { title: 'Guided meditation', url: 'https://www.example.com/meditation/guided.mp4' },
  ],
  Intermediate: [
    { title: 'Body Scan Meditation', url: 'https://www.example.com/meditation/body-scan.mp4' },
    { title: 'Metta (Loving-kindness) meditation', url: 'https://www.example.com/meditation/metta.mp4' },
    { title: 'Tonglen (giving and receiving)', url: 'https://www.example.com/meditation/tonglen.mp4' },
    { title: 'Compassion meditation', url: 'https://www.example.com/meditation/compassion.mp4' },
    { title: 'Prayer meditation', url: 'https://www.example.com/meditation/prayer.mp4' },
    { title: 'Devotional chanting (Bhakti)', url: 'https://www.example.com/meditation/bhakti.mp4' },
    { title: 'Kundalini meditation', url: 'https://www.example.com/meditation/kundalini.mp4' },
    { title: 'Chakra meditation', url: 'https://www.example.com/meditation/chakra.mp4' },
    { title: 'Yoga Nidra', url: 'https://www.example.com/meditation/yoga-nidra.mp4' },
    { title: 'Sound meditation (singing bowls, gong)', url: 'https://www.example.com/meditation/sound.mp4' },
    { title: 'Qigong meditation', url: 'https://www.example.com/meditation/qigong.mp4' },
    { title: 'Analytical meditation', url: 'https://www.example.com/meditation/analytical.mp4' },
  ],
  Advanced: [
    { title: 'Stoic reflection', url: 'https://www.example.com/meditation/stoic.mp4' },
    { title: 'Dynamic meditation (Osho)', url: 'https://www.example.com/meditation/dynamic.mp4' },
    { title: 'Movement meditation (tai chi, mindful dance)', url: 'https://www.example.com/meditation/movement.mp4' },
    { title: 'Silent retreat (Vipassana, Zen sesshin)', url: 'https://www.example.com/meditation/retreat.mp4' },
    { title: 'Advanced Visualization', url: 'https://www.example.com/meditation/advanced-visualization.mp4' },
    { title: 'Deep Chakra Meditation', url: 'https://www.example.com/meditation/deep-chakra.mp4' },
    { title: 'Tantric meditation', url: 'https://www.example.com/meditation/tantric.mp4' },
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
