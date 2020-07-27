import React, { Fragment, useState } from 'react';
import '../css/main.css';

const EditModal = ({book, CSRFToken, end}) => {
    const [isShowed, setIsShowed] = useState(false);
    const [title,  setTitle ] = useState(book.title);
    const [description, setDescription] = useState(book.description);
    const [Loading, setLoading] = useState(false);

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            const body = { title, description };
            await fetch(`/books/${book.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json",
                          "CSRF-Token" : CSRFToken},
                body: JSON.stringify(body)
            }).then(
                setLoading(false)
            )
            .then(
                alert('Book successfuly edited!')
            ).then(
                end()
            );
        } catch (err) {
            console.error(err.message)            
        }
    }

    function loading () {
        if (Loading) {
            return (
                <div className="modal">
                    <div className="loadingContent">
                        <img src='./greyLoading.svg' width='100px' alt="Loading..."></img>
                    </div>
                </div>
            )
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
            <div className="modal">
                <div className= "modalContent">
                    <div style={{textAlign: "center"}}>
                        <h2>Edit Book</h2>

                        <form onSubmit={onSubmitForm}>                        
                            Title:
                            <br /> 
                            <textarea 
                                cols="40"
                                rows="3"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                            <br />
                            <br />
                            Description: 
                            <br /> 
                            <textarea 
                                cols="40"
                                rows="10"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />    
                        </form>
                        <br />
                        <table width="100%">
                                <tbody>
                                    <td width="50%">
                                        <button onClick={() => setIsShowed(!isShowed)}>close</button>
                                    </td>
                                    <td width="50%">
                                        <button 
                                            onClick={onSubmitForm}
                                            className='AddButton'>
                                            Change
                                        </button>
                                    </td>
                                </tbody>
                            </table> 
                    </div>
                </div>
                {loading()}
            </div>
        );
    };
}

export default EditModal;
