import React, { Component, PropTypes } from 'react';
import Months from '../constants/Months';

export default class TicketPanel extends Component {
    static propTypes = {
        ticket: PropTypes.object.isRequired,
    }
    render() {
        const { ticket } = this.props;
        let creationString = (date) => { return 'Created ' + Months[date.getMonth()] + ' ' + date.getDate(); }(new Date(ticket.created));
        creationString += (ticket.discriminator == 'github_ticket') ? ' on Github' : ' on Rebase';
        return (
            <div id='ticketPanel'>
                <span>{ticket.title}</span>
                <span>{creationString}</span>
                <button className='notification'>Close issue</button>
            </div>
        );
    }
};
