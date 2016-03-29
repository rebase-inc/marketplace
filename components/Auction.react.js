import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';

import { getAuctionTicket } from '../utils/getters';
import { humanReadableTimeRemaining, humanReadableDate } from '../utils/date';

import AuctionStatus from './AuctionStatus.react';
import AuctionTimer from './AuctionTimer.react';
import RejectedIcon from './RejectedIcon.react';



const Auction = (props) => props.role.type == 'manager' ? <ManagerAuction {...props} /> : <DeveloperAuction {...props} />;

const ManagerAuction = (props) => (
    <ListElement {...getAuctionTicket(props)} {...props}
        prefix={'Expires in ' + humanReadableTimeRemaining(props.expires)}
        info={('$' + props.ticket_set.bid_limits[0].price)}
        icon={<AuctionStatus {...props}/>}
        subtitle={Object.keys(getAuctionTicket(props).skill_requirement.skills).join(' ')}
        />
);

const DeveloperAuction = (props) => (
    <ListElement {...getAuctionTicket(props)} {...props}
        prefix={'Expires in ' + humanReadableTimeRemaining(props.expires)}
        info={props.bids.find(b => b.contractor.id == props.role.id) ? <RejectedIcon /> : null }
        icon={<AuctionTimer {...props}/>}
        subtitle={Object.keys(getAuctionTicket(props).skill_requirement.skills).join(' ')}
        />
);

export default Auction;
