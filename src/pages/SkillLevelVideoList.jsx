// src/pages/SkillLevelVideoList.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Grid, Paper, Typography } from '@mui/material';

export default function SkillLevelVideoList({
  categoryName,
  levels,
  videosByLevel,
  icon: Icon,
  onSelectVideo,
  tabColor = '#7b1fa2',  // <-- Add default color or receive it as prop
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleLevelChange = (_, newValue) => {
    setTabIndex(levels.indexOf(newValue));
    setSelectedVideo(null);
  };

  const currentLevel = levels[tabIndex];
  const videos = videosByLevel[currentLevel] || [];

  const handleVideoClick = (title) => {
    setSelectedVideo(title);
    onSelectVideo(title);
  };

  return (
    <Box>
      {/* Skill Level Tabs */}
      <Tabs
        value={currentLevel}
        onChange={handleLevelChange}
        textColor="inherit"
        indicatorColor="primary"
        aria-label={`${categoryName} skill levels`}
        sx={{
          mb: 2,
          '& .MuiTabs-indicator': { backgroundColor: tabColor },
          '& .MuiTab-root': {
            color: '#ccc',
            fontWeight: '600',
            '&.Mui-selected': { color: tabColor, fontWeight: 'bold' },
          },
        }}
      >
        {levels.map((level) => (
          <Tab key={level} label={level} value={level} />
        ))}
      </Tabs>

      {/* Video List */}
      <Grid container spacing={3}>
        {videos.map(({ title }) => (
          <Grid item xs={12} sm={6} md={4} key={title}>
            <Paper
              onClick={() => handleVideoClick(title)}
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid #555',
                borderRadius: 2,
                backgroundColor: selectedVideo === title ? tabColor + '33' : 'transparent',
                transition: 'background-color 0.3s',
                '&:hover': { backgroundColor: tabColor + '55' },
              }}
              elevation={3}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Icon sx={{ color: tabColor, mr: 1 }} />
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>{title}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
