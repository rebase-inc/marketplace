import React, { Component, PropTypes } from 'react';

import DropbackIcon from './DropbackIcon.react';
import ThreeDotsIcon from './ThreeDotsIcon.react';

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
                </div>
                <div className='otherInfo'>
                    { this.props.children }
                </div>
            </div>
        )
    }
};
