import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import NavButton from '../NavButton';

let mockPush = vi.fn();
let mockPathname = '/book';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
}));

describe('NavButton Component', () => {
  afterEach(() => {
    mockPush.mockClear();
  });

  it('renders "Go to Loans" when on the /book page', () => {
    mockPathname = '/book';
    render(<NavButton />);
    const button = screen.getByRole('button', { name: /Go to Loans/i });
    expect(button).toBeInTheDocument();
  });

  it('renders "Go to Books" when on other pages', () => {
    mockPathname = '/loans';
    render(<NavButton />);
    const button = screen.getByRole('button', { name: /Go to Books/i });
    expect(button).toBeInTheDocument();
  });

  it('navigates to /loans when button is clicked on the /book page', () => {
    mockPathname = '/book';
    render(<NavButton />);
    const button = screen.getByRole('button', { name: /Go to Loans/i });
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/loans');
  });

  it('navigates to /book when button is clicked on other pages', () => {
    mockPathname = '/loans';
    render(<NavButton />);
    const button = screen.getByRole('button', { name: /Go to Books/i });
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/book');
  });
});
