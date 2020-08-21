import { SHOW_LOADER, HIDE_LOADER, SHOW_ALERT, HIDE_ALERT, SHOW_MODAL, HIDE_MODAL, GET_CSRF } from "./types"

const initialState = {
    loading: false,
    alert: null,
    isShowed: false,
    CSRFToken: null
}

export const appReducer = ( state = initialState, action ) => {
    switch (action.type) {
        case SHOW_LOADER: 
            return {...state, loading: true};
        case HIDE_LOADER: 
            return {...state, loading: false};
        case SHOW_ALERT: 
            return {...state, alert: action.payload};
        case HIDE_ALERT: 
            return {...state, alert: null};
        case SHOW_MODAL:
            return {...state, isShowed: true};
        case HIDE_MODAL:
            return {...state, isShowed: false};
        case GET_CSRF:
            return {...state, CSRFToken: action.payload}
        default: return state
    }
}