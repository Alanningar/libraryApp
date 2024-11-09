import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import MyLoans from '../MyLoans';

global.fetch = vi.fn();

describe('MyLoans Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('123');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays loaned books correctly', async () => {
    const mockBooks = [
      { id: '1', title: 'Book One', author: 'Author One', cover: 'cover1.jpg', released: '2020', subgenre: 'Fantasy' },
      { id: '2', title: 'Book Two', author: 'Author Two', cover: 'cover2.jpg', released: '2021', subgenre: 'Sci-Fi' },
    ];

    const mockLoanData1 = { loans: [{ userId: '123', return: '2023-12-31' }] };
    const mockLoanData2 = { loans: [] };

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockBooks })
      .mockResolvedValueOnce({ ok: true, json: async () => mockLoanData1 })
      .mockResolvedValueOnce({ ok: true, json: async () => mockLoanData2 });

    await act(async () => {
      render(<MyLoans />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Book One/i)).toBeInTheDocument();
      expect(screen.getByText(/Author One/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Book One cover/i)).toBeInTheDocument();
      expect(screen.getByText(/Fantasy/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Book Two/i)).toBeNull();
  });

  it('displays a message when there are no loaned books', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    await act(async () => {
      render(<MyLoans />);
    });

    await waitFor(() => {
      expect(screen.getByText(/You have no loaned books./i)).toBeInTheDocument();
    });
  });

  it('shows an error message when user ID is not found', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    await act(async () => {
      render(<MyLoans />);
    });

    await waitFor(() => {
      expect(screen.getByText(/User ID not found./i)).toBeInTheDocument();
    });
  });

  it('displays an error message on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch books.'));

    await act(async () => {
      render(<MyLoans />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch books./i)).toBeInTheDocument();
    });
  });
});
