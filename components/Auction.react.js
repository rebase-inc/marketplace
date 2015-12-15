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
                    <span>{ role.type == 'manager' ? 'Expires in ' + humanReadableTimeRemaining(auction.expires) : ticket.project.name + ',' + ticket.project.organization.name }</span>
                    <span>{ ticket.title }</span>
                    { Object.keys(ticket.skill_requirement.skills).map(s => <div key={s} className='skill'>{s}</div>) }
                </div>
                <div className='extraInfo'>
                    { role.type == 'manager' ? <span>{'$' + auction.ticket_set.bid_limits[0].price}</span> : null }
                    { role.type == 'manager' ? <FindTalentOverview auction={auction} /> : null }
                    { role.type == 'contractor' ? <Timer expires={auction.expires} /> : null }
                </div>
            </div>
        );
    }
}
