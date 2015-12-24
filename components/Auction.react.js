import React, { Component, PropTypes } from 'react';

import { FindTalentOverview, Timer } from './Icons.react';

import { getAuctionTicket } from '../utils/getters';
import { humanReadableTimeRemaining } from '../utils/date';

// Effectively just a passthrough component based on current role
export default class Auction extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        role: PropTypes.object.isRequired,
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { role, auction, select, selected } = this.props;
        const ticket = getAuctionTicket(auction);
        return (
            <div className='auction' onClick={select} data-selected={selected || undefined}>
                <div className='mainInfo'>
                    <span className='title'>{ ticket.title }</span>
                    <span>{ role.type == 'manager' ? 'Expires in ' + humanReadableTimeRemaining(auction.expires) : ticket.project.name + ',' + ticket.project.organization.name }</span>
                </div>
                <div className='extraInfo'>
                    { role.type == 'manager' ? <span>{'$' + auction.ticket_set.bid_limits[0].price}</span> : null }
                    { role.type == 'manager' ? <TalentSummary auction={auction} /> : null }
                    { role.type == 'contractor' ? <Timer expires={auction.expires} /> : null }
                </div>
            </div>
        );
    }
}

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
