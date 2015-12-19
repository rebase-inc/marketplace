import React, { Component, PropTypes } from 'react';

import TicketTimeline from './TicketTimeline.react';

export default class AuctionHeader extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        warning: PropTypes.bool,
    }

    render() {
        const { ticket, openNewAuctionModal, role  } = this.props;
        console.log('children are ', this.props.children);
        return (
            <div className='infoHeader'>
                <div className='mainInfo'>
                    <span className='title'>{ticket.title}</span>
                    { this.props.children.filter(c => !!c) }
                    { /* the filter above is to get around a weird chrome/react bug where having null and non-null children mixed causes rendering issues */}
                </div>
                <div className='otherInfo'>
                    <TicketTimeline role={role} current={'auction'} />
                </div>
            </div>
        )
    }
};
