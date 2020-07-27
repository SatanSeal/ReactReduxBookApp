import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; 

const Search = () => {

    let history = useHistory();

    const [Select,  setSelect ] = useState('Title');
    const [Value, setValue ] = useState('');

    const onSearchClick = async () => {
        if (Value === "") {
            return alert(`${Select} required!`)
        }
        history.push(`/search=${Select.toLowerCase()}=${Value}`);
    };

    const enterCheck = (event) => {
        if (event.key === 'Enter'){
            onSearchClick();
        }
    };

    return (
        <div>
            <select style={{height: '22px'}} onChange={e => setSelect(e.target.value)}>
                <option>Title</option>
                <option>Author</option>
                <option>Description</option>
                <option>id</option>
            </select>
            <input type="text" onChange={e => setValue(e.target.value)} onKeyPress={enterCheck}/>
            <button onClick={onSearchClick}>Search</button>
        </div>
    );
};

export default Search;