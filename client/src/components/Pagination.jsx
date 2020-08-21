import React, {useState} from 'react';
import { connect, useSelector, useDispatch } from 'react-redux'
import '../css/main.css';
import { showAlert, setCurrentPage } from '../redux/actions';

const Pagination = ({ totalBooks}) => {

    const [inputPage, setInputPage] = useState(1);

    const dispatch = useDispatch()
    const booksPerPage = useSelector(state => state.books.booksPerPage)
    const CurrentPage = useSelector(state => state.books.currentPage)

    let pageNumbers = Math.ceil(totalBooks / booksPerPage);

    function prevPage () {
        if (CurrentPage !== 1) {
            dispatch(setCurrentPage(CurrentPage-1))
        } else {
            dispatch(showAlert("It's first page!"))
        }
    }

    function nextPage () {
        if (CurrentPage !== pageNumbers) {
            dispatch(setCurrentPage(CurrentPage+1))
        } else {
            alert("It's last page!");
        }
    }

    function checkAndGo () {
        if (!Number.isInteger(+inputPage)) {
            return alert('bad')
        }
        if (inputPage < 1) {
            return alert('Page must be greater than 0')
        }
        if (inputPage > pageNumbers) {
            return alert(`Page must be less than ${pageNumbers}`)
        }
        dispatch(setCurrentPage(inputPage))
    }

    const enterCheck = (event) => {
        if (event.key === 'Enter'){
            checkAndGo();
        }
    };

    return (
        <div style={{ textAlign: 'center'}}>
            <div>
                <img style={{cursor: "pointer", bottom: '-5px', position: 'relative'}} 
                     width="1.5%" 
                     src="./doubleLeft.png" 
                     alt='prevPage' 
                     onClick={()=> prevPage()}>
                </img>
                <font size="3"><strong> {CurrentPage}/{pageNumbers} </strong></font>
                <img style={{cursor: "pointer", bottom: '-5px', position: 'relative'}} 
                     width="1.5%" 
                     src="./doubleRight.png" 
                     alt='prevPage' 
                     onClick={()=> nextPage()}>
                </img>            </div>
            <div style={{paddingTop: "10px"}}>
                <label>Page: </label>
                <input type="text" style={{width: "25px"}} onChange={e => setInputPage(+e.target.value)} onKeyPress={enterCheck}/>
                <button onClick={()=>checkAndGo()}>go!</button>
            </div>
        </div>    
    )   
}

export default connect(null, null)(Pagination);