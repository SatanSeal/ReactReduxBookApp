import { GET_BOOKS, SET_BOOKS_PER_PAGE, SET_CURRENT_PAGE } from "./types"

const initialState = {
    books: [],
    booksPerPage: 4,
    currentPage: 1
}

export const booksReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_BOOKS: 
            return { ...state, books: action.payload}
        case SET_BOOKS_PER_PAGE:
            return {...state, booksPerPage: action.payload}
        case SET_CURRENT_PAGE: 
            return {...state, currentPage: action.payload}
        default: return state
    }
}