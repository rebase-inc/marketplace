import React, { Component, PropTypes } from 'react';

import EndIcon from './EndIcon.react';
import BidIcon from './BidIcon.react';

import { getAuctionTicket } from '../utils/getters';

export default class AuctionHeader extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        warning: PropTypes.bool,
    }

    render() {
        const { auction, openBidModal, role, toggleTalentView, showTalent, makeNotification } = this.props;
        const clickHandler = role.type == 'contractor' ? openBidModal : toggleTalentView;
        return (
            <div className='infoHeader'>
                <div className='tool'>
                    { role.type == 'manager' ?  <span>{'$' + auction.ticket_set.bid_limits[0].price}</span> : null }
                </div>
                <div className='mainInfo'>
                    <span className='title'>{getAuctionTicket(auction).title}</span>
                </div>
                <div className='tool'>
                    { role.type == 'manager' ? <EndIcon onClick={makeNotification.bind(null, 'Not implemented!!')}/> : <BidIcon onClick={openBidModal} /> }
                </div>
            </div>
        )
    }
};
