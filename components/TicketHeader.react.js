import React, { Component, PropTypes } from 'react';

import DropbackIcon from './DropbackIcon.react';
import ThreeDotsIcon from './ThreeDotsIcon.react';

export default class TicketHeader extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        unselect: PropTypes.func.isRequired,
        toggleDetails: PropTypes.func.isRequired,
        neutral: PropTypes.bool,
        notification: PropTypes.bool,
        okay: PropTypes.bool,
        alert: PropTypes.bool,
        warning: PropTypes.bool,
    }
    
    render() {
        const { title, unselect, toggleDetails, children } = this.props; 
        const { neutral, notification, okay, alert, warning } = this.props;
        return (
            <div id='itemHeader'
                data-neutral={neutral} 
                data-notification={notification} 
                data-okay={okay} 
                data-alert={alert} 
                data-warning={warning} >
                <DropbackIcon onClick={unselect} />
                { children }
                <ThreeDotsIcon onClick={toggleDetails} />
                <span className='title'>{title}</span>
            </div>
        );
    }
};
