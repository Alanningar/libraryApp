

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BookView from '../BookView';


global.fetch = vi.fn();

describe('BookView Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('fetches and displays books based on selected genre and stock filter', async () => {
        const mockBooks = [
            {
                cover: 'cover1.jpg',
                title: 'Book One',
                author: 'Author One',
                released: '2020',
                subgenre: 'Fantasy',
            },
            {
                cover: 'cover2.jpg',
                title: 'Book Two',
                author: 'Author Two',
                released: '2021',
                subgenre: 'Science Fiction',
            },
        ];

        fetch.mockResolvedValueOnce({
            json: async () => mockBooks,
        });

        render(<BookView selectedGenre="fantasy" inStockOnly={true} />);

        expect(fetch).toHaveBeenCalledWith('/api/book?genre=Fantasy&inStockOnly=true');

        await waitFor(() => {
            mockBooks.forEach(({ title }) => {
                expect(screen.getByText(title)).toBeInTheDocument();
            });
        });
    });

    it('displays no books when no data is returned', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => [],
        });

        render(<BookView selectedGenre="fantasy" inStockOnly={true} />);

        await waitFor(() => {
            expect(screen.queryByText(/Book/)).toBeNull();
        });
    });
});
