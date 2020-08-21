import React from 'react';
import { render } from 'react-dom';
import thunk from 'redux-thunk';
import App from './App';
import { createStore, compose, applyMiddleware } from 'redux';
import { rootReducer } from './redux/rootReducer';
import { Provider } from 'react-redux';

const store = createStore(rootReducer, compose(
    applyMiddleware(
        thunk
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // remove in production!!!
    
))

const app = (
    <Provider store={store}>
        <App />
    </Provider>
)

render(app , document.getElementById('root'));