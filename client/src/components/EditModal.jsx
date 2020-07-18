import React, { Fragment, useState } from 'react';
import '../css/main.css';

const EditModal = ({book, CSRFToken, end}) => {
    const [isShowed, setIsShowed] = useState(false);
    const [title,  setTitle ] = useState(book.title);
    const [description, setDescription] = useState(book.description);

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { title, description };
            await fetch(`/books/${book.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json",
                          "CSRF-Token" : CSRFToken},
                body: JSON.stringify(body)
            }).then(
                alert('Book successfuly edited!')
            ).then(
                end()
            );
        } catch (err) {
            console.error(err.message)            
        }
    }

    if (!isShowed) {
        return (
            <Fragment>
                <button 
                onClick={() => setIsShowed({isShowed: !isShowed})} 
                className="EditButton">
                    Edit Book
                </button>
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <div className="modal">
                    <div className= "modalContent">
                    <form onSubmit={onSubmitForm}>
                        <input 
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        />
                        <br/>
                        <input
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        />
                        <button className="AddButton">Change</button>
                    </form>
                        <button onClick={() => setIsShowed(!isShowed)}>Close</button>
                    </div>
                </div>
            </ Fragment>
        );
    };
}

export default EditModal;
