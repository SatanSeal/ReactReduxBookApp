import React, { useState } from 'react';
import { useHistory} from 'react-router-dom';

const Search = () => {

    const history = useHistory();

    const [Select,  setSelect ] = useState('title');
    const [Value, setValue ] = useState('');

    const onSearchClick = () => {
        history.push(`/books/search=${Select}=${Value}`)
    };

    return (
        <div>
            <select onChange={e => setSelect(e.target.value.toLowerCase())}>
                <option>Title</option>
                <option>id</option>
            </select>
            <input type="text" onChange={e => setValue(e.target.value)} />
            <button onClick={onSearchClick}>Search</button>
        </div>
    );
};

export default Search;