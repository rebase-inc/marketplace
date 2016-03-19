import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


export default class Actions extends Component {
    static propTypes = {
        approve:    PropTypes.func.isRequired,
        hide:       PropTypes.func.isRequired,
        nomination: PropTypes.object.isRequired,
    }

    render() {
        const { approve, hide, nomination } = this.props;
        return (
            <div className='devPubProfileActions' id='devActions'>
                <button className='devPubProfileAction' id='devActionApprove' onClick={(e) => approve() && e.stopPropagation()} >approve</button>
                <button className='devPubProfileAction' id='devActionHide' onClick={hide} >hide</button>
            </div>
        );
    }
}
