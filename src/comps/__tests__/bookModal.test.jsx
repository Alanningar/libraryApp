import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import BookModal from '../BookModal';

global.fetch = vi.fn();
global.alert = vi.fn();  // Mock window.alert

// Helper function to create a delayed promise
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('BookModal Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        alert.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders without crashing and shows loading initially', async () => {
        // Mock delayed fetch responses to simulate loading state
        fetch.mockImplementationOnce(() =>
            delay(50).then(() =>
                Promise.resolve({
                    ok: true,
                    json: async () => ({ id: '1', title: 'Test Book', author: 'Author Name', summary: 'Summary of the book', cover: '/path/to/cover.jpg' }),
                })
            )
        ).mockImplementationOnce(() =>
            delay(50).then(() =>
                Promise.resolve({
                    ok: true,
                    json: async () => [], // No loans to simulate the unloaned state
                })
            )
        );

        await act(async () => {
            render(<BookModal BookId="1" closeModal={vi.fn()} currentUserId="123" />);
        });

        // Check that "Loading..." text is shown initially before the API calls resolve
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

        // Wait for the component to load the book data after the delay
        await waitFor(() => {
            expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
        });
    });

    it('fetches and displays book data correctly', async () => {
        const mockBookData = {
            id: '1',
            title: 'Test Book',
            author: 'Author Name',
            summary: 'Summary of the book',
            cover: '/path/to/cover.jpg',
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockBookData,
        }).mockResolvedValueOnce({
            ok: true,
            json: async () => [],  // No loans
        });

        await act(async () => {
            render(<BookModal BookId="1" closeModal={vi.fn()} currentUserId="123" />);
        });

        expect(fetch).toHaveBeenCalledWith('/api/book?id=1');

        await waitFor(() => {
            expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
            expect(screen.getByText(/Author Name/i)).toBeInTheDocument();
        });
    });

    it('displays error message on API failure', async () => {
        // Simulate a failed fetch request for book data
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Failed to fetch book' }),
        }).mockResolvedValueOnce({
            ok: true,
            json: async () => [],  // Mocking second fetch to prevent error in fetchLoanStatus
        });

        await act(async () => {
            render(<BookModal BookId="1" closeModal={vi.fn()} currentUserId="123" />);
        });

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch book/i)).toBeInTheDocument();
        });
    });

    it('loans book successfully when Loan button is clicked', async () => {
        const mockLoanResponse = { success: true };

        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', title: 'Test Book' }) }) // For fetchBook
            .mockResolvedValueOnce({ ok: true, json: async () => [] }) // For fetchLoanStatus
            .mockResolvedValueOnce({ ok: true, json: async () => mockLoanResponse }); // For handleLoan

        await act(async () => {
            render(<BookModal BookId="1" closeModal={vi.fn()} currentUserId="123" />);
        });

        const loanButton = await screen.findByRole('button', { name: /Loan for 1 Month/i });
        await act(async () => {
            fireEvent.click(loanButton);
        });

        await waitFor(() => {
            expect(alert).toHaveBeenCalledWith('Book loaned successfully!');
            expect(screen.queryByRole('button', { name: /Loan for 1 Month/i })).not.toBeInTheDocument();
        });
    });

    it('closes modal when Close button is clicked', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', title: 'Test Book' }) });

        const closeModal = vi.fn();
        await act(async () => {
            render(<BookModal BookId="1" closeModal={closeModal} currentUserId="123" />);
        });

        const closeButton = await screen.findByText(/Close/i);
        fireEvent.click(closeButton);

        expect(closeModal).toHaveBeenCalled();
    });
});
