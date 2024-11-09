"use client";
import React, { useState, useEffect } from 'react';
import BookModal from './BookModal';

function MyLoans() {
    const [loanedBooks, setLoanedBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('User ID not found.');
            return;
        }

        async function fetchLoanedBooks() {
            try {
                const booksResponse = await fetch('${window.location.origin}/api/book');
                if (!booksResponse.ok) {
                    throw new Error('Failed to fetch books.');
                }
                const books = await booksResponse.json();

                const loanedBooksPromises = books.map(async (book) => {
                    const loanResponse = await fetch(`${window.location.origin}/api/loan?bookId=${book.id}`);
                    if (!loanResponse.ok) {
                        throw new Error(`Failed to fetch loan status for book ID: ${book.id}`);
                    }
                    const loanData = await loanResponse.json();
                    const userLoan = loanData.loans.find(lo => lo.userId === userId);

                    if (userLoan) {
                        return { ...book, returnDate: userLoan.return };
                    }
                    return null;
                });

                const loanedBooksResults = await Promise.all(loanedBooksPromises);
                const filteredLoanedBooks = loanedBooksResults.filter(book => book !== null);
                setLoanedBooks(filteredLoanedBooks);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchLoanedBooks();
    }, []);

    const getReturnDateInfo = (returnDate) => {
        const today = new Date();
        const returnDateObj = new Date(returnDate);
        const diffTime = returnDateObj - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { color: 'red', daysLeft: Math.abs(diffDays) };
        } else if (diffDays <= 7) {
            return { color: 'yellow', daysLeft: diffDays };
        } else {
            return { color: 'green', daysLeft: diffDays };
        }
    };

    const handleBookClick = (id) => {
        setSelectedBookId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBookId(null);
        window.location.reload();
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="Books">
            {loanedBooks.length === 0 ? (
                <p>You have no loaned books.</p>
            ) : (
                loanedBooks.map(({ cover, title, author, released, subgenre, id, returnDate }) => {
                    const returnInfo = getReturnDateInfo(returnDate);
                    const returnClass = returnInfo.color;
                    return (
                        <div className="Book" key={id} onClick={() => handleBookClick(id)}>
                            <img className="BookCover" src={cover} alt={`${title} cover`} />
                            <div className="BookInfo">
                                <div className="ReturnDateContainer">
                                    <h1>{title}</h1>
                                    <div className="ReturnDate">
                                        <span className={`ReturnDateCircle ${returnClass}`}></span>
                                        <span>
                                            {returnInfo.daysLeft > 0
                                                ? `${returnInfo.daysLeft} days left`
                                                : `Late by ${Math.abs(returnInfo.daysLeft)} days`}
                                        </span>
                                    </div>
                                </div>
                                <h2>{author} | {released}</h2>
                                <h3>{subgenre}</h3>
                            </div>
                        </div>
                    );
                })
            )}
            {isModalOpen && <BookModal BookId={selectedBookId} closeModal={closeModal} currentUserId={localStorage.getItem('userId')} />}
        </div>
    );
}

export default MyLoans;
