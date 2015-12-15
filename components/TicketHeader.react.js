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
        const { ticket, openNewAuctionModal, role  } = this.props;
        return (
            <div className='infoHeader'>
                <div className='mainInfo'>
                    <span className='title'>{ticket.title}</span>
                    {/*<ContractStatus contract={contract} role={role} />*/}
                </div>
                <div className='otherInfo'>
                    <button onClick={openNewAuctionModal}>Find Developers</button>
                </div>
            </div>
        )
    }
};
