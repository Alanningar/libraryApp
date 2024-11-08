// Login.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login'
import { vi } from 'vitest';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Login Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the login form correctly', () => {
    render(<Login />);
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('submits the form with correct credentials and redirects to /book', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/book');
    });
  });

  test('displays error message when login fails', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false, message: 'Invalid credentials' }),
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'wrong@arcada.fi' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
