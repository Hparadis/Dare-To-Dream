// src/components/tests/Progress.test.jsx
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import Progress from '../../pages/Progress';

test('renders Meditation Videos title', () => {
    render(<Progress />);
    const heading = screen.getByText(/meditation videos/i);
    expect(heading).toBeInTheDocument();
  });
  
