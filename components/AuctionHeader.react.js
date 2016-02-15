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
                <div className='tool'>
                    {/*<TicketTimeline role={role} current={'auction'} />*/}
                </div>
                <div className='mainInfo'>
                    <span className='title'>{getAuctionTicket(auction).title}</span>
                    {/*<button onClick={clickHandler}>{buttonString}</button>*/}
                </div>
                <div className='tool'>
                    {/*<TicketTimeline role={role} current={'auction'} />*/}
                </div>
            </div>
        )
    }
};
