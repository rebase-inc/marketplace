import React, { Component, PropTypes } from 'react';

import NothingHere from './NothingHere.react';

export default class NoAuctionsView extends Component {
    static propTypes = {
        viewNewTickets: PropTypes.func.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { viewNewTickets, role } = this.props;
        const nothingHereString = role.type == 'manager' ?
            'Any tickets that you set a budget for will appear here with a summary of the data about the offer.' :
                'Any tickets that have been offered to you will appear here with information about who offered them to you.';
        return (
            <NothingHere>
                <h3>{ role.type == 'manager' ? 'Your Auctions' : 'Your Offers' }</h3>
                <h4>{ nothingHereString }</h4>
                { role.type == 'manager' ? <button onClick={viewNewTickets}>View New Tickets</button> :
                    <button>See Sample Offer</button> }
            </NothingHere>
        );
    }
}
