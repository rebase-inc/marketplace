import React, { Component, PropTypes } from 'react';

import TicketTimeline from './TicketTimeline.react';

import { getAuctionTicket } from '../utils/getters';

export default class AuctionHeader extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        warning: PropTypes.bool,
    }

    render() {
        const { auction, openBidModal, role, toggleTalentView, showTalent  } = this.props;
        const clickHandler = role.type == 'contractor' ? openBidModal : toggleTalentView;
        const buttonString = role.type == 'contractor' ? 'Bid Now' : (showTalent ? 'View Ticket Details' : 'View Suggested Developers');
        return (
            <div className='infoHeader'>
                <div className='mainInfo'>
                    <span className='title'>{getAuctionTicket(auction).title}</span>
                    { role.type == 'manager' ? <span className='extra'>{'Offered to developers for a maximum of $' + auction.ticket_set.bid_limits[0].price}</span> : null }
                    <button onClick={clickHandler}>{buttonString}</button>
                </div>
                <div className='otherInfo'>
                    <TicketTimeline role={role} current={'auction'} />
                </div>
            </div>
        )
    }
};
