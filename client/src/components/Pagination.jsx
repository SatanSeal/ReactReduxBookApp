import React from 'react';
import '../css/main.css';

const Pagination = ({booksPerPage, totalBooks, paginate}) => {
    const pageNumbers = [];

    for (let i=1; i <= Math.ceil(totalBooks / booksPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <table className='paginationTable'>
            <tbody>
                <tr>
                    {pageNumbers.map(number => (
                        <td key={number} >
                            <button onClick={()=> paginate(number)}>
                                {number}
                            </button>
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}

export default Pagination;