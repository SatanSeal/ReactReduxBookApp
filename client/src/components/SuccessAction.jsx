import React, { Fragment } from 'react'
import '../css/main.css'

class SuccessAction extends React.Component {
    
    constructor(props) {
        super(props);
        this.holderRef = React.createRef();
      }

    handleClick() {
        const holder = this.holderRef.current;
        holder.classList.add('opacity: 1')
    }
    
    render() {
        return (
            <Fragment>
                <div ref={this.holderRef} className='holder' id='successAction'>
                    <div className='block'>
                        <div></div>
                    </div>
                </div>
                <button onClick={() => this.handleClick()}>show</button>
            </Fragment>

        )
    }
}

export default SuccessAction