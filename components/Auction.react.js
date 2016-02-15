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

export class TalentSummary extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { infoString: '' }
    }

    render() {
        const { auction } = this.props;
        const overbid = auction.bids.filter(b => !b.contract).length;
        const approved = auction.approved_talents.length - overbid;
        const suggested = auction.ticket_set.nominations.filter(n => !auction.approved_talents.find(t => t.contractor.id == n.contractor.id)).length;
        const total = overbid + approved + suggested;
        return (
            <svg className='talentSummary' viewBox='0 0 120 34' height='34px' width='120px' onMouseLeave={() => this.setState({ infoString: '' })}>
                <rect x='0' y='0'  height='20px' width={120*(approved / total) + 'px'} fill='#507196' onMouseOver={() => this.setState({ infoString: approved + ' approved developers'})} />
                <rect x={120*(approved / total) + 'px'} y='0' height='20px' width={120*(overbid / total) + 'px'} fill='#CC6070' onMouseOver={() => this.setState({ infoString: overbid + ' uninterested developers'})} />
                <rect x={120*((overbid + approved) / total ) + 'px'} y='0' height='20px' width={120*(suggested / total) + 'px'} fill='#F6D49C' onMouseOver={() => this.setState({ infoString: suggested + ' unapproved developers'})}/>
                <text x='60' textAnchor='middle' y='30' fontSize='10px'>{this.state.infoString}</text>
            </svg>
        );
    }
}
