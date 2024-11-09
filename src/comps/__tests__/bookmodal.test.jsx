import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookModal from '../BookModal';
import { vi } from 'vitest';

describe('BookModal Component', () => {
    const mockCloseModal = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should display loading initially', () => {
        render(<BookModal BookId="123" closeModal={mockCloseModal} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should fetch book data and display it', async () => {
        const mockBook = {
            cover: '/path/to/cover.jpg',
            title: 'Test Book',
            author: 'John Doe',
            summary: 'This is a test summary.',
        };

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockBook),
            })
        );

        render(<BookModal BookId="123" closeModal={mockCloseModal} />);
        
        await waitFor(() => expect(screen.getByText('Test Book')).toBeInTheDocument());
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('This is a test summary.')).toBeInTheDocument();
        expect(screen.getByAltText('Test Book cover')).toBeInTheDocument();
    });

    it('should display an error message if fetching fails', async () => {
        global.fetch = vi.fn(() => Promise.resolve({ ok: false }));

        render(<BookModal BookId="123" closeModal={mockCloseModal} />);

        await waitFor(() => expect(screen.getByText('Failed to fetch book')).toBeInTheDocument());
    });

    it('should call closeModal when Close button is clicked', async () => {
        const mockBook = {
            cover: '/path/to/cover.jpg',
            title: 'Test Book',
            author: 'John Doe',
            summary: 'This is a test summary.',
        };

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockBook),
            })
        );

        render(<BookModal BookId="123" closeModal={mockCloseModal} />);

        // Wait for book data to be displayed
        await waitFor(() => expect(screen.getByText('Test Book')).toBeInTheDocument());

        const closeButton = screen.getByRole('button', { name: /Close/i });
        
        // Use await with userEvent.click to ensure the interaction is awaited
        await userEvent.click(closeButton);

        // Verify that closeModal was called once
        await waitFor(() => expect(mockCloseModal).toHaveBeenCalledTimes(1));
    });

    it('should not fetch book data if BookId is not provided', () => {
        render(<BookModal closeModal={mockCloseModal} />);
        expect(global.fetch).not.toHaveBeenCalled();
    });
});
