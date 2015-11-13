import React, { Component, PropTypes } from 'react';

const MonthNames = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default class TicketDetails extends Component {
    static propTypes = {
        ticket: PropTypes.object.isRequired,
        hidden: PropTypes.bool.isRequired,
    }
    render() {
        const { ticket, hidden } = this.props;
        console.log('Ticket:', ticket);
        let creationString = (date) => { return 'Created ' + MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(ticket.created));
        creationString += (ticket.descriminator == 'github_ticket') ? ' on Github' : 'on Rebase';
        return (
            <div className={hidden ? 'hidden' : 'visible'} id='itemDetails'>
                <div id='mainInfo'>
                    <span>{ticket.title}</span>
                    <span>{creationString}</span>
                    <button className='notification'>Close issue</button>
                </div>
                <div id='technicalInfo'>
                    <div>
                        <span>Clone</span>
                        <span>{ticket.project.work_repo.clone || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Deploy</span>
                        <span>{ticket.project.deploy || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Test</span>
                        <span>{ticket.project.test || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Readme</span>
                        <span>{ticket.project.readme || 'n/a'}</span>
                    </div>
                </div>
            </div>
        );
    }
};
