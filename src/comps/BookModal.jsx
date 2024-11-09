import React, { useEffect, useState } from 'react';

function BookModal({ BookId, closeModal }) {
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchBook() {
            try {
                console.log('Fetching book with ID:', BookId);
                const response = await fetch(`/api/book?id=${BookId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch book');
                }
                const data = await response.json();
                setBook(data);
                console.log('Fetched book:', data); // Log book info to console
            } catch (error) {
                setError(error.message);
            }
        }

        if (BookId) {
            fetchBook();
        }
    }, [BookId]);

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
                        
                        <button id="loan">Loan</button>
                    </div>    
                    <button id="Close" onClick={closeModal}>Close</button>   
                </div>
            )}
        </div>
    );
}

export default BookModal;