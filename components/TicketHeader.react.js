import React, { Component, PropTypes } from 'react';

import TicketTimeline from './TicketTimeline.react';
import FindTalentIcon from './FindTalentIcon.react';

export default class TicketHeader extends Component {
    static propTypes = {
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
                <div className='tool'>
                    {/*<TicketTimeline role={role} current={'create'} />*/}
                </div>
                <div className='mainInfo'>
                    {ticket.title}
                </div>
                <div className='tool'>
                    <FindTalentIcon onClick={openNewAuctionModal} i/>
                </div>
            </div>
        )
    }
};
