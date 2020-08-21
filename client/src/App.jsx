import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

//components
import BookList from './BookList';
import Home from './Home';
import SingleBook from './SingleBook';
import SearchedBooks from './SearchedBooks';
import NotFound from './NotFound';
import Registration from './Registration';
import Login from './Login';
import User from './User';
import BookList2 from './BookList2';

function App() {
    return (
        <Router>
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/books' exact component={BookList}/>
                <Route path='/books2' exact component={BookList2}/>
                <Route path='/search=:title=:value' exact component={SearchedBooks} /> 
                <Route path='/book_:id' exact component={SingleBook} /> 
                <Route path='/registration' exact component={Registration} />
                <Route path='/login' exact component={Login} />
                <Route path='/user' exact component={User}/> 
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};
export default App;