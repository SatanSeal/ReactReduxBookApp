import React from 'react';
import { useHistory } from 'react-router-dom';

const PureLogoHeader = () => {

    let history = useHistory();

    return (
        <table className="HeaderTable" cellPadding='20'>
            <tbody>
                <tr >
                    <td width="33%" >
                    </td>
                    <td width="33%" align='center'>
                        <img src="./sl.png" className="HeaderLogo" alt='logo' onClick={() => history.push('/')}/>
                    </td>
                    <td width="33%" align='right'>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default PureLogoHeader;