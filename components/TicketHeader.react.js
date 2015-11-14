import React, { Component, PropTypes } from 'react';

import DropbackIcon from './DropbackIcon.react';
import ThreeDotsIcon from './ThreeDotsIcon.react';

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
                <DropbackIcon onClick={unselect} />
                { children }
                <ThreeDotsIcon onClick={toggleDetails} />
                <span className='title'>{title}</span>
            </div>
        );
    }
};
