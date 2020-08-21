import React, { Fragment, useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from 'react-redux';
import { showAlert, postBook, showModal, hideModal, getCSRFToken } from '../redux/actions'
import '../css/main.css';

const AddModal = ({author}) => {

    const dispatch = useDispatch()
    
    const Loading = useSelector(state => state.app.loading)
    const isShowed = useSelector(state => state.app.isShowed)
    const Alert = useSelector(state => state.app.alert)  
    const CSRFToken = useSelector(state => state.app.CSRFToken)

    const [title,  setTitle ] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        dispatch(getCSRFToken())
        // eslint-disable-next-line
    }, []);
    

    const onSubmitForm = async e => {
        e.preventDefault();
        if (!title.trim()) {
            return dispatch(showAlert('Title required!'))
        }
        if (!description.trim()) {
            return dispatch(showAlert('Description required!')) 
        }
        const body = { title, description, author }
        dispatch(postBook( body, CSRFToken))
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
                onClick={() => dispatch(showModal())}
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

                        {Alert && <div className="alert">{Alert}</div>}
                        {Alert && <br />}

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
                                <tr>
                                    <td width="50%">
                                        <button 
                                            onClick={() => dispatch(hideModal())}
                                        >
                                                close
                                        </button>
                                    </td>
                                    <td width="50%">
                                        <button 
                                            onClick={onSubmitForm}
                                            className='AddButton'>
                                            Add Book
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table> 
                    </div>
                </div>
                {loading()}
            </ Fragment>
        );
    };
};

/*   another way to get from redux-store

const mapDispatchToProps = {
    showAlert, showModal
}
const mapStateToProps = state => ({
    Alert: state.app.alert,
    Loading: state.app.loading,
    isShowed: state.app.isShowed
})
export default connect(mapStateToProps, mapDispatchToProps)(AddModal);

and add 'props.' before each element and add 'props' for import in component */


export default connect(null, null)(AddModal);