import React, { Component, PropTypes } from 'react';

import TicketTimeline from './TicketTimeline.react';

export default class TicketHeader extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        warning: PropTypes.bool,
    }

    render() {
        const { ticket, openNewAuctionModal, role  } = this.props;
        return (
            <div className='infoHeader'>
                <div className='mainInfo'>
                    <span className='title'>{ticket.title}</span>
                    { this.props.children }
                </div>
                <div className='otherInfo'>
                    <TicketTimeline role={role} current={'auction'} />
                </div>
            </div>
        )
    }
};
