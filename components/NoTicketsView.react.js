import React, { Component, PropTypes } from 'react';

import NothingHere from './NothingHere.react';

export default class NoTicketsView extends Component {
    static propTypes = { openNewTicketModal: PropTypes.func.isRequired }
    render() {
        return (
            <NothingHere>
                <h3>Your Tickets</h3>
                <h4>If you have unassigned tickets, they'll appear here. Tickets can be created on Rebase or imported from GitHub</h4>
                <div>
                    <button onClick={this.props.openNewTicketModal}>Add New Ticket</button>
                    <button data-notification>Import Project</button>
                </div>
            </NothingHere>
        );
    }
}
