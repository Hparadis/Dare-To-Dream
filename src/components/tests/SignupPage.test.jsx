import { render, screen, fireEvent, act } from '@testing-library/react';
import SignupPage from '../../pages/SignupPage';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignupPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('signup form submits and redirects to /survey on success', async () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your first name/i), {
      target: { value: 'John' },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter your last name/i), {
      target: { value: 'Doe' },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByTestId('signup-button'));

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/survey');
  });
});
