import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';

import { getAuctionTicket } from '../utils/getters';
import { humanReadableTimeRemaining } from '../utils/date';

import AuctionStatus from './AuctionStatus.react';

const CommentDetails = (props) => (
    <div>
        <Comment />
        <span>{props.comments.length}</span>
    </div>
);

const Auction = (props) => (
    <ListElement {...getAuctionTicket(props)} {...props}
        date={humanReadableTimeRemaining(props.expires)}
        icon={<AuctionStatus {...props}/>}
        subtitle={ Object.keys(getAuctionTicket(props).skill_requirement.skills).join(' ') }
        extra={ props.role.type == 'manager' ?  <span>{'$' + props.ticket_set.bid_limits[0].price}</span> : <CommentDetails {...props.ticket} /> }
        />
);

export default Auction;
