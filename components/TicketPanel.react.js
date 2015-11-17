import React, { Component, PropTypes } from 'react';
import MonthNames from '../constants/Months';

export default class TicketPanel extends Component {
    static propTypes = {
        ticket: PropTypes.object.isRequired,
    }
    render() {
        const { ticket } = this.props;
        let creationString = (date) => { return 'Created ' + MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(ticket.created));
        creationString += (ticket.discriminator == 'github_ticket') ? ' on Github' : ' on Rebase';
        return (
            <div id='mainInfo'>
                <span>{ticket.title}</span>
                <span>{creationString}</span>
                <button className='notification'>Close issue</button>
            </div>
        );
    }
};
