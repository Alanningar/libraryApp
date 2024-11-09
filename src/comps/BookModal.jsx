import React, { useEffect, useState } from 'react';

function BookModal({ BookId, closeModal, currentUserId }) {
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loanedToUser, setLoanedToUser] = useState(false); 
    const [stock, setStock] = useState(0);

    useEffect(() => {
        async function fetchBook() {
            try {
                const response = await fetch(`/api/book?id=${BookId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch book');
                }
                const data = await response.json();
                setBook(data);
                setStock(data.stock);
            } catch (error) {
                setError(error.message);
            }
        }

        async function fetchLoanStatus() {
            const userId = localStorage.getItem('userId'); 
            try {
                const response = await fetch(`/api/loan?bookId=${BookId}&userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch loan status');
                }
                const data = await response.json();
                setLoanedToUser(data.loanedToUser); 
                setStock(data.stock);
            } catch (error) {
                setError(error.message);
            }
        }

        if (BookId) {
            fetchBook();
            fetchLoanStatus();
        }
    }, [BookId, currentUserId]);

    const handleReturn = async (bookId) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`/api/loan?userId=${userId}&bookId=${bookId}`, {
                method: 'DELETE',
            });
    
            const data = await response.json();
            if (data.success) {
                setLoanedToUser(false); 
                setStock((prevStock) => prevStock + 1);
            } else {
                alert(data.message || 'Failed to return the book.');
            }
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    const handleLoan = async () => {
        const userId = localStorage.getItem('userId'); 
        if (stock <= 0) {
            alert("This book is out of stock.");
            return;
        }

        try {
            const response = await fetch('/api/loan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, bookId: BookId }),
            });

            const data = await response.json();
            if (data.success) {
                setLoanedToUser(true);
                setStock((prevStock) => prevStock - 1);
            } else {
                alert(data.message || 'Failed to loan the book.');
            }
        } catch (error) {
            console.error('Error loaning book:', error);
        }
    };

    return (
        <div className="modal">
            {error && <div className="error">{error}</div>}
            {!book && !error && <div>Loading...</div>}
            {book && (
                <div className="book-details">
                    <img src={book.cover} alt={`${book.title} cover`} className="BookCover" />
                    <div className="book-info">
                        <div id="title-author">
                            <h2 id="title">{book.title}</h2>
                            <p id="author">{book.author}</p>
                        </div>
                        <div id="divider"></div>
                        <p id="title2"> Summary </p>
                        <p id="summary">{book.summary}</p>
                        <p id="stock">Stock: {stock}</p>

                        {loanedToUser ? (
                            <button className="ReturnButton" onClick={() => handleReturn(book.id)}>Return Book</button>
                        ) : (
                            <button className="LoanButton" onClick={() => handleLoan(book.id)} disabled={stock <= 0}>
                                {stock <= 0 ? 'Out of Stock' : 'Loan for 1 Month'}
                            </button>
                        )}
                    </div>
                    <button id="Close" onClick={closeModal}>Close</button>
                </div>
            )}
        </div>
    );
}

export default BookModal;