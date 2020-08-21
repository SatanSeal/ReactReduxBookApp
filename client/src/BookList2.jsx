import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import './css/main.css'
import Books from './components/Books'
import MyHeader from './components/MyHeader'
import MyFooter from './components/myFooter'
import Pagination from './components/Pagination'
import { useSelector, useDispatch } from 'react-redux'
import { getBooks, setBPP } from './redux/actions'

const BookList2 = (props) => {

    const dispatch = useDispatch()
    const AllBooks = useSelector(state => state.books.books)
    const Loading = useSelector(state => state.app.loading)    
    const BooksPerPage = useSelector(state => state.books.booksPerPage)
    const CurrentPage = useSelector(state => state.books.currentPage)

    const indexOfLastBook = CurrentPage * BooksPerPage;
    const indexOfFirstBook = indexOfLastBook - BooksPerPage;
    const CurrentBooks = AllBooks.slice(indexOfFirstBook,indexOfLastBook);

    useEffect(() => {
        dispatch(getBooks())
        // eslint-disable-next-line
    }, [])

    function booksLoading () {
        if (Loading) {
            return (
                <div style={{textAlign: 'center', paddingTop: '50px'}}>
                    <img src='./lightGreenLoading.svg' width='100px' alt="Loading..."></img> 
                </div>
            )
        }
        /*if (props.alert) {
            return (
                <div className="alert">{props.alert}</div>
            )
        }*/
        if (AllBooks.length === 0) {
            return (
                <Fragment>
                    <h1 style={{textAlign: 'center'}}>Sorry, but library is empty...</h1>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    {props.alert && <div className="alert">{props.alert}</div>}
                    <div style={{paddingTop: "5px", paddingRight: "5px", textAlign: "right"}}>
                        <font>Books per page: </font>
                        <br /> 
                        <input id="BPPinput" type="text" size="1" maxLength="3" placeholder="4"></input>
                        <button onClick={() => dispatch(setBPP(+document.getElementById('BPPinput').value))}>Set</button>
                    </div>
                    <h1 style={{textAlign: 'center'}}>BookList</h1>

                    <Books books={CurrentBooks} />
                    <Pagination 
                        totalBooks={AllBooks.length} 
                    />
                </Fragment>
            )
        }
    }

    return (
        <Fragment>
            <MyHeader />
            {booksLoading()}
            <MyFooter />
        </Fragment>
    );
};

const mapStateToProps = state => ({
    alert: state.app.alert
})

export default connect(mapStateToProps, null)(BookList2);