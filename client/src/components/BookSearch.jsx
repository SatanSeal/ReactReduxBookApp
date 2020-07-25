import React, { useState } from 'react';

const Search = () => {

    const [Select,  setSelect ] = useState('title');
    const [Value, setValue ] = useState('');

    const onSearchClick = () => {
        //history.push(`/search=${Select}=${Value}`)    not search again at already searched page
        window.location.href=`/search=${Select}=${Value}`
    };

    const enterCheck = (event) => {
        if (event.key === 'Enter'){
            onSearchClick();
        }
    };

    return (
        <div>
            <select onChange={e => setSelect(e.target.value.toLowerCase())}>
                <option>Title</option>
                <option>Author</option>
                <option>id</option>
            </select>
            <input type="text" onChange={e => setValue(e.target.value)} onKeyPress={enterCheck}/>
            <button onClick={onSearchClick}>Search</button>
        </div>
    );
};

export default Search;