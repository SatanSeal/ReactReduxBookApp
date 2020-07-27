import React, {useState} from 'react';
import '../css/main.css';

const Pagination = ({booksPerPage, totalBooks, paginate, CurrentPage}) => {

    const [inputPage, setInputPage] = useState(1);

    let pageNumbers = Math.ceil(totalBooks / booksPerPage);

    function prevPage () {
        if (CurrentPage !== 1) {
            paginate(CurrentPage-1)
        } else {
            alert("It's first page!");
        }
    }

    function nextPage () {
        if (CurrentPage !== pageNumbers) {
            paginate(CurrentPage+1)
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
        paginate(inputPage)
    }

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
                <input type="text" style={{width: "25px"}} onChange={e => setInputPage(+e.target.value)}/>
                <button onClick={()=>checkAndGo()}>go!</button>
            </div>
        </div>    
    )   
}

export default Pagination;