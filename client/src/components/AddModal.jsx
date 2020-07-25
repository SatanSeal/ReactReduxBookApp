import React, { Fragment, useState, useEffect } from "react";
import '../css/main.css';

const AddModal = ({author}) => {

    const [title,  setTitle ] = useState('');
    const [description, setDescription] = useState('');
    const [isShowed, setIsShowed] = useState(false);
    const [CSRFToken, setCSRFToken] = useState();

    const getCSRFToken = async () => {
        const response = await fetch ('/secure/csrf-token');
        const token = await response.json();
        setCSRFToken(JSON.stringify(token).split('"')[3]);
    };

    useEffect(() => {
        getCSRFToken();
    }, []);

    const onSubmitForm = async e => {
        e.preventDefault();
        if (title === '') {
            return alert('Title required!');
        }
        if (description === '') {
            return alert('Description required!');
        }
        try {
            const body = { title, description, author };
            await fetch("/books/add", {
                method: "POST",
                headers: {"Content-Type": "application/json",
                          "CSRF-Token" : CSRFToken},
                body: JSON.stringify(body)
            }).then(
                alert('Book successfuly added!')
            ).then(
                setIsShowed(false)
            );
        } catch (err) {
            console.error(err.message)            
        }
    };

        if (!isShowed) {
            return (
                <Fragment>
                    <button 
                    onClick={() => setIsShowed(!isShowed)}
                    className='AddButton'>
                        Add Book
                    </button>
                </Fragment>
            );
        } else {
            return(
                <Fragment>
                    <div className="modal">
                        <div className= "modalContent">
                            <h2>Add a book</h2>
                            <form onSubmit={onSubmitForm}>
                                Title: <input 
                                    type="text"
                                    onChange={e => setTitle(e.target.value)}
                                />
                                <br/>
                                Description: <input
                                    type="text"
                                    onChange={e => setDescription(e.target.value)}
                                />
                                <br />
                                <button 
                                    className='AddButton'>
                                    Add Book
                                </button>
                            </form>
                            <button onClick={() => setIsShowed(!isShowed)}> close</button>
                        </div>
                    </div>
                </ Fragment>
            );
        };
    };

export default AddModal;