import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GenreSelector, StockFilter } from '../Selector'; 

describe('GenreSelector Component', () => {
    it('renders with default "Select a genre" option', () => {
        const setSelectedGenre = vi.fn();
        render(<GenreSelector selectedGenre="None" setSelectedGenre={setSelectedGenre} />);
        
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
        expect(select.value).toBe('none');
    });

    it('calls setSelectedGenre on change', () => {
        const setSelectedGenre = vi.fn();
        render(<GenreSelector selectedGenre="None" setSelectedGenre={setSelectedGenre} />);
        
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'fiction' } });
        
        expect(setSelectedGenre).toHaveBeenCalledWith('fiction');
    });
});

describe('StockFilter Component', () => {
    it('renders checkbox with correct initial checked state', () => {
        const setInStockOnly = vi.fn();
        render(<StockFilter inStockOnly={false} setInStockOnly={setInStockOnly} />);
        
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox.checked).toBe(false);
    });

    it('calls setInStockOnly on checkbox toggle', () => {
        const setInStockOnly = vi.fn();
        render(<StockFilter inStockOnly={false} setInStockOnly={setInStockOnly} />);
        
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        
        expect(setInStockOnly).toHaveBeenCalledWith(true);
    });
});
