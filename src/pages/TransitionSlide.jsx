// src/pages/TransitionSlide.jsx
import React, { forwardRef } from 'react';
import Slide from '@mui/material/Slide';

const TransitionSlide = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default TransitionSlide;
