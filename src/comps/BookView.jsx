"use client";

import { useEffect, useState } from 'react';

function BookView({ selectedGenre, inStockOnly }) {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const genre = selectedGenre === 'none' ? '' : selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1);
        console.log('Fetching books for genre:', genre);
        const query = `/api/book?genre=${genre}&inStockOnly=${inStockOnly}`;
        fetch(query)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched books:', data);
                setBooks(data);
            })
            .catch(error => console.error('Error fetching books:', error));
    }, [selectedGenre, inStockOnly]);

    return (
        <div className="Books">
            {books.map(({ cover, title, author, released, subgenre }, i) => (
                <div className="Book" key={i}>
                    <img className="BookCover" src={cover} alt="bookCover" />
                    <div className="BookInfo">
                        <h1>{title}</h1>
                        <h2>{author} | {released} </h2>
                        <h3>{subgenre}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BookView;