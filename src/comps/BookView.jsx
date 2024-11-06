"use client";

import { useEffect, useState } from 'react';

function BookView() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch('/api/book/')
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    return (
        <div className="Books">
            {books.map(({ cover, title, author, released, genre }, i) => (
                <div className="Book" key={i}>
                    <img className="BookCover" src={cover} alt="bookCover" />
                    <div className="BookInfo">
                        <h1>{title}</h1>
                        <h2>{author} | {released} </h2>
                        <h3>{genre}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BookView;
