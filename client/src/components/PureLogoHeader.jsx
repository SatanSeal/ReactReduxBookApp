import React from 'react';
import { Link } from 'react-router-dom';

const PureLogoHeader = () => {

    return (
        <table className="HeaderTable" cellPadding='20'>
            <tbody>
                <tr >
                    <td width="33%" >
                    </td>
                    <td width="33%" align='center'>
                        <Link to='/'>
                            <img src="./sl.png" className="HeaderLogo" alt='logo'/>
                        </Link>
                    </td>
                    <td width="33%" align='right'>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default PureLogoHeader;