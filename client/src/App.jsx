import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

//components
import BookList from './components/BookList';
import Home from './Home';
import SingleBook from './SingleBook';
import SearchedBooks from './SearchedBooks';
import NotFound from './NotFound';
import Registration from './Registration';
import Login from './Login';

function App() {
    return (
        <Router>
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/books' exact component={BookList}/>
                <Route path='/books/:id' exact component={SingleBook} />
                <Route path='/search=:title=:value' exact component={SearchedBooks} />
                <Route path='/registration' exact component={Registration} />
                <Route path='/login' exact component={Login} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};
export default App;