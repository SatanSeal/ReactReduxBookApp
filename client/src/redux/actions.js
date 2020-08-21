import { GET_BOOKS, SHOW_LOADER, HIDE_LOADER, SHOW_ALERT, HIDE_ALERT, SHOW_MODAL, HIDE_MODAL, GET_CSRF, SET_BOOKS_PER_PAGE, SET_CURRENT_PAGE } from "./types";

export function showLoader() {
    return {
        type: SHOW_LOADER
    }
}

export function hideLoader() {
    return {
        type: HIDE_LOADER
    }
}

export function showAlert(text) {
    return dispatch => {
        dispatch({
            type: SHOW_ALERT,
            payload: text
        })
        
        setTimeout(() => {
            dispatch(hideAlert())
        }, 4000)
    }
}

export function hideAlert() {
    return {
        type: HIDE_ALERT
    }
}

export function showModal() {
    return {
        type: SHOW_MODAL
    }
}

export function hideModal() {
    return { type: HIDE_MODAL }
}

export function getCSRFToken() {
    return async dispatch => {
        try {
            const response = await fetch ('/secure/csrf-token');
            const data = await response.json();
            const token = JSON.stringify(data).split('"')[3]
            dispatch({ type: GET_CSRF, payload: token})
        } catch (e) {
            console.log('something goes wrong with CSRF')
        }
    }
}

export function getBooks() {
    return async dispatch => {
        try {
            dispatch(showLoader())
            const response = await fetch('/books')
            const jsonData = await response.json();
            dispatch({ type: GET_BOOKS, payload: jsonData })
            dispatch(hideLoader())     
        } catch (e) {
            dispatch(showAlert('Sorry, something goes wrong with fetching')) 
            dispatch(hideLoader())
        }
    }
}

export function postBook( body, CSRFToken ) {
    return async dispatch => {
        try {
            dispatch(showLoader())
            await fetch("/books/add", {
                method: "POST",
                headers: {"Content-Type": "application/json",
                        "CSRF-Token" : CSRFToken},
                body: JSON.stringify(body)
            })
            dispatch(hideLoader())
            dispatch(hideModal())
        } catch (e) {
            dispatch(showAlert('Sorry, something goes wrong with adding book')) 
            dispatch(hideLoader())
        }
    }

}

export function setBPP(BPPval){
    return dispatch => {
        if (!Number.isInteger(BPPval)){
            dispatch({ type: SET_BOOKS_PER_PAGE, payload: 4})
            dispatch(showAlert('Incorrect input!'));
        }
        if (BPPval === 0) {
            alert(Number.isInteger(BPPval))
            dispatch(showAlert('Books per page cannot be 0!'));
            dispatch({ type: SET_BOOKS_PER_PAGE, payload: 4})   // not working 0_o
        }
        setCurrentPage(1);
        dispatch({ type: SET_BOOKS_PER_PAGE, payload: BPPval})
    }
}

export function setCurrentPage(value){
    return { type: SET_CURRENT_PAGE, payload: value}
}