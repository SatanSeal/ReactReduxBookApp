import { combineReducers } from "redux";
import { booksReducer } from "./booksReducer";
import { appReducer } from "./appReducer";

export const rootReducer = combineReducers({
    books: booksReducer,
    app: appReducer
})