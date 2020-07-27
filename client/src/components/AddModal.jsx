import React, { Fragment, useState, useEffect } from "react";
import '../css/main.css';

const AddModal = ({author}) => {

    const [title,  setTitle ] = useState('');
    const [description, setDescription] = useState('');
    const [isShowed, setIsShowed] = useState(false);
    const [CSRFToken, setCSRFToken] = useState();
    const [Loading, setLoading] = useState(false);

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
            setLoading(true);
            const body = { title, description, author };
            await fetch("/books/add", {
                method: "POST",
                headers: {"Content-Type": "application/json",
                          "CSRF-Token" : CSRFToken},
                body: JSON.stringify(body)
            }).then(
                setLoading(false)
            )
            .then(
                alert('Book successfuly added!')
            ).then(
                setIsShowed(false)
            );
        } catch (err) {
            console.error(err.message)            
        }
    };

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
                    <div className= "modalContent" style={{textAlign: 'center'}}>
                        <h2 >Add a book</h2>
                        <form onSubmit={onSubmitForm}>
                            Title:
                            <br /> 
                            <textarea 
                                cols="40"
                                rows="3"
                                onChange={e => setTitle(e.target.value)}
                            />
                            <br />
                            <br />
                            Description: 
                            <br /> 
                            <textarea 
                                cols="40"
                                rows="10"
                                onChange={e => setDescription(e.target.value)}
                            />
                            <br />
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
                                        Add Book
                                    </button>
                                </td>
                            </tbody>
                        </table> 
                    </div>
                </div>
                {loading()}
            </ Fragment>
        );
    };
};

export default AddModal;