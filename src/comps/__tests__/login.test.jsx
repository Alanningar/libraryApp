import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login'
import { useRouter } from 'next/navigation';
import loginInfo from '../logininfo';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Login Component', () => {
  const mockRouterPush = vi.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockRouterPush,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with email and password fields', () => {
    render(<Login />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('displays error message if login fails', () => {
    render(<Login />);
    
    //mocking a wrong login
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    //see if it gets the error msg
    expect(screen.getByText('höhö try again')).toBeInTheDocument();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('navigates to /book on correct login', () => {
    const validUser = { name: '123', password: '123' };
    loginInfo.push(validUser);

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: validUser.name } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: validUser.password } });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(mockRouterPush).toHaveBeenCalledWith('/book');
  });

  it('updates email and password states on input change', () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    //checks that init valus are empty
    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');

    fireEvent.change(emailInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    expect(emailInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');
  });
});
