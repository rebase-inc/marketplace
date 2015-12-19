import React, { Component, PropTypes } from 'react';

import TicketTimeline from './TicketTimeline.react';

export default class AuctionHeader extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        warning: PropTypes.bool,
    }

    render() {
        const { title, openNewAuctionModal, role, toggleTalentView, showTalent  } = this.props;
        const clickHandler = role.type == 'contractor' ? openBidModal : toggleTalentView;
        const buttonString = role.type == 'contractor' ? 'Bid Now' : (showTalent ? 'View Details' : 'View Developers');
        return (
            <div className='infoHeader'>
                <div className='mainInfo'>
                    <span className='title'>{title}</span>
                    <button onClick={clickHandler}>{buttonString}</button>
                </div>
                <div className='otherInfo'>
                    <TicketTimeline role={role} current={'auction'} />
                </div>
            </div>
        )
    }
};
