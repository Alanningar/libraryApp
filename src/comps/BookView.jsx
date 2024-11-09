import React, { useState, useEffect } from 'react';
import BookModal from './BookModal';

function BookView({ selectedGenre, inStockOnly, userId }) {
    const [books, setBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const genre = selectedGenre === 'none' ? '' : selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1);
        const query = `/api/book?genre=${genre}&inStockOnly=${inStockOnly}`;
        fetch(query)
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching books:', error));
    }, [selectedGenre, inStockOnly, userId]);

    const handleBookClick = (id) => {
        setSelectedBookId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBookId(null);
    };

    return (
        <div className="Books">
            {books.map(({ cover, title, author, released, subgenre, id }, i) => (
                <div className="Book" key={i} onClick={() => handleBookClick(id)}>
                    <img className="BookCover" src={cover} alt="bookCover" />
                    <div className="BookInfo">
                        <h1>{title}</h1>
                        <h2>{author} | {released}</h2>
                        <h3>{subgenre}</h3>
                    </div>
                </div>
            ))}
            {isModalOpen && <BookModal BookId={selectedBookId} closeModal={closeModal}/>}
        </div>
    );
}

export default BookView;
