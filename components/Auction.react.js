import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';

import { getAuctionTicket } from '../utils/getters';
import { humanReadableTimeRemaining, humanReadableDate } from '../utils/date';

import AuctionStatus from './AuctionStatus.react';

const CommentDetails = (props) => (
    <div>
        <Comment />
        <span>{props.comments.length}</span>
    </div>
);

const Auction = (props) => (
    <ListElement {...getAuctionTicket(props)} {...props}
        prefix={'Expires in ' + humanReadableTimeRemaining(props.expires)}
        info={ props.role.type == 'manager' ? ('$' + props.ticket_set.bid_limits[0].price) : null }
        icon={<AuctionStatus {...props}/>}
        subtitle={Object.keys(getAuctionTicket(props).skill_requirement.skills).join(' ')}
        />
);

export default Auction;
