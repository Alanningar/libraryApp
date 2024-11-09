import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import BookModal from '../BookModal';

global.fetch = vi.fn();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('BookModal Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders without crashing and shows loading initially', async () => {
        fetch.mockImplementationOnce(() =>
            delay(50).then(() =>
                Promise.resolve({
                    ok: true,
                    json: async () => ({ id: '1', title: 'Test Book', author: 'Author Name', summary: 'Summary of the book', cover: '/path/to/cover.jpg', stock: 5 }),
                })
            )
        ).mockImplementationOnce(() =>
            delay(50).then(() =>
                Promise.resolve({
                    ok: true,
                    json: async () => ({ loanedToUser: false, stock: 5 }),
                })
            )
        );

        await act(async () => {
            render(<BookModal BookId="1" closeModal={vi.fn()} currentUserId="123" />);
        });

        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
            expect(screen.getByText(/Stock: 5/i)).toBeInTheDocument();
        });
    });

    it('displays "Out of Stock" when stock is 0 and disables the loan button', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: '1', title: 'Out of Stock Book', stock: 0 }),
        }).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ loanedToUser: false, stock: 0 }),
        });

        await act(async () => {
            render(<BookModal BookId="1" closeModal={vi.fn()} currentUserId="123" />);
        });

        await waitFor(() => {
            expect(screen.getByText(/Out of Stock Book/i)).toBeInTheDocument();
            expect(screen.getByText(/Stock: 0/i)).toBeInTheDocument();
            const loanButton = screen.getByRole('button', { name: /Out of Stock/i });
            expect(loanButton).toBeDisabled();
        });
    });

    it('loans book successfully and decreases stock by 1', async () => {
        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', title: 'Loanable Book', stock: 1 }) }) 
            .mockResolvedValueOnce({ ok: true, json: async () => ({ loanedToUser: false, stock: 1 }) }) 
            .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }); 

        await act(async () => {
            render(<BookModal BookId="1" closeModal={vi.fn()} currentUserId="123" />);
        });
    
        const loanButton = await screen.findByRole('button', { name: /Loan for 1 Month/i });
    
        await act(async () => {
            fireEvent.click(loanButton);
        });
    
        await waitFor(() => {
            expect(screen.getByText(/Stock: 0/i)).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /Loan for 1 Month/i })).not.toBeInTheDocument();
        });
    
        const returnButton = screen.getByRole('button', { name: /Return Book/i });
        expect(returnButton).toBeInTheDocument();
        expect(returnButton).toBeEnabled();
    });
    
    it('returns book successfully and increases stock by 1', async () => {
        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', title: 'Returnable Book', stock: 0 }) }) // Initial fetch to render book details
            .mockResolvedValueOnce({ ok: true, json: async () => ({ loanedToUser: true, stock: 0 }) }) // User has a loan for this book
            .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }) // Return action success
            .mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', stock: 1 }) }); // Updated stock after return
    
        await act(async () => {
            render(<BookModal BookId="1" closeModal={vi.fn()} currentUserId="123" />);
        });
    
        // Locate the "Return Book" button to simulate the return action
        const returnButton = await waitFor(() => screen.getByRole('button', { name: /Return Book/i }));
    
        await act(async () => {
            fireEvent.click(returnButton);
        });
    
        // Verify that stock has increased, and the "Loan for 1 Month" button reappears
        await waitFor(() => {
            expect(screen.getByText(/Stock: 1/i)).toBeInTheDocument();
            const loanButton = screen.getByRole('button', { name: /Loan for 1 Month/i });
            expect(loanButton).toBeEnabled();
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
