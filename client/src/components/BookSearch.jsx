import React, { useState } from 'react';

const Search = () => {

    const [Select,  setSelect ] = useState('title');
    const [Value, setValue ] = useState('');

    const onSearchClick = () => {
        window.location.href=`/search=${Select}=${Value}`;
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