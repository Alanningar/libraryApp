import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BookView from '../BookView';


vi.stubGlobal('fetch', vi.fn());

describe('BookView Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders a list of books', async () => {
    const mockBooks = [
      { cover: 'cover1.jpg', title: 'Book 1', author: 'Author 1', released: '2020', genre: 'Fiction' },
      { cover: 'cover2.jpg', title: 'Book 2', author: 'Author 2', released: '2021', genre: 'Non-fiction' }
    ];
    fetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(mockBooks),
    });

    render(<BookView />);

    await waitFor(() => {
      expect(screen.getByText('Book 1')).toBeInTheDocument();
      expect(screen.getByText('Book 2')).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Author 1'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Author 2'))).toBeInTheDocument();
    });
  });

  it('shows book details correctly', async () => {
    const mockBooks = [
      { cover: 'cover1.jpg', title: 'Book 1', author: 'Author 1', released: '2020', genre: 'Fiction' },
    ];
    fetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(mockBooks),
    });

    render(<BookView />);

    await waitFor(() => {
      expect(screen.getByText('Book 1')).toBeInTheDocument();
      expect(screen.getByText('Author 1 | 2020')).toBeInTheDocument();
      expect(screen.getByText('Fiction')).toBeInTheDocument();
      expect(screen.getByAltText('bookCover')).toHaveAttribute('src', 'cover1.jpg');
    });
  });
});
