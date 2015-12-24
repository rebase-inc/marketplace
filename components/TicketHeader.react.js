import React, { Component, PropTypes } from 'react';

import TicketTimeline from './TicketTimeline.react';

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
        const { ticket, openNewAuctionModal, role  } = this.props;
        return (
            <div className='infoHeader'>
                <div className='mainInfo'>
                    <span className='title'>{ticket.title}</span>
                    <button onClick={openNewAuctionModal}>Find Developers</button>
                </div>
                <div className='otherInfo'>
                    <TicketTimeline role={role} current={'create'} />
                </div>
            </div>
        )
    }
};
