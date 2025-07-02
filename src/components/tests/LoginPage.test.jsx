import { vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import LoginPage from '../../pages/LoginPage';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('login form submits and redirects to /home on success', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByTestId('login-button'));

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
