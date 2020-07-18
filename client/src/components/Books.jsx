import React from 'react';
import { Link } from 'react-router-dom';
import '../css/main.css';

const Books = ({books, loading}) => {

    if (loading) {
        return (
            <h1 className='loading'>Loading...</h1>
        )
    }
    return (
        <ul type='none' className='bookArchive'>
            {books.map(book => (
                <Link to={`/books/${book.id}`} key={book.id} className='bookLink'>
                    <li className='book'>
                        <strong>Title:</strong> {book.title} 
                        <br /> 
                        <strong>Description:</strong> {book.description}
                        <br />
                    </li>
                </Link>
            ))}
        </ul>
    )
};

export default Books;