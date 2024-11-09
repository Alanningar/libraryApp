"use client";

import { useEffect, useState } from 'react';

function BookView({ selectedGenre, inStockOnly, userId }) {
    const [books, setBooks] = useState([]);
    const [loanedBooks, setLoanedBooks] = useState(new Set());

    useEffect(() => {
        const genre = selectedGenre === 'none' ? '' : selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1);
        const query = `/api/book?genre=${genre}&inStockOnly=${inStockOnly}`;

        // Fetch books
        fetch(query)
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching books:', error));

        // Fetch loaned books for the user
        fetch(`/api/loan?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                const loanedBookIds = new Set(data.map(loan => loan.bookId));
                setLoanedBooks(loanedBookIds);
            })
            .catch(error => console.error('Error fetching loaned books:', error));
    }, [selectedGenre, inStockOnly, userId]);

    // Handle loaning a book
    const handleLoan = async (bookId) => {
        try {
            const response = await fetch('/api/loan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, bookId }),
            });

            const data = await response.json();
            if (data.success) {
                setLoanedBooks(new Set(loanedBooks).add(bookId));
                alert('Book loaned successfully!');
            } else {
                alert(data.message || 'Failed to loan the book.');
            }
        } catch (error) {
            console.error('Error loaning book:', error);
            alert('An error occurred while trying to loan the book.');
        }
    };

    // Handle returning a book
    const handleReturn = async (bookId) => {
        try {
            const response = await fetch(`/api/loan?userId=${userId}&bookId=${bookId}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                const updatedLoanedBooks = new Set(loanedBooks);
                updatedLoanedBooks.delete(bookId);
                setLoanedBooks(updatedLoanedBooks);
                alert('Book returned successfully!');
            } else {
                alert(data.message || 'Failed to return the book.');
            }
        } catch (error) {
            console.error('Error returning book:', error);
            alert('An error occurred while trying to return the book.');
        }
    };

    return (
        <div className="Books">
            {books.map(({ id, cover, title, author, released, subgenre }) => (
                <div className="Book" key={id}>
                    <img className="BookCover" src={cover} alt="bookCover" />
                    <div className="BookInfo">
                        <h1>{title}</h1>
                        <h2>{author} | {released}</h2>
                        <h3>{subgenre}</h3>
                        {loanedBooks.has(id) ? (
                            <button className="ReturnButton" onClick={() => handleReturn(id)}>Return Book</button>
                        ) : (
                            <button className="LoanButton" onClick={() => handleLoan(id)}>Loan for 1 Month</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BookView;
