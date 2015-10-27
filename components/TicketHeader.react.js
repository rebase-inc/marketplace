import React, { Component, PropTypes } from 'react';

import { Dropback } from './Icons.react';

export default class TicketHeader extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        unselect: PropTypes.func.isRequired,
        toggleDetails: PropTypes.func.isRequired,
    }
    
    render() {
        const { title, unselect, toggleDetails, children } = this.props; 
        return (
            <div id='itemHeader'>
                <div onClick={unselect} className='backButton'><Dropback/></div>
                { children }
                <img onClick={toggleDetails} className='details' src='img/three-dots.svg'/>
                <span className='title'>{title}</span>
            </div>
        );
    }
};
