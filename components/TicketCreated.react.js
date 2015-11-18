import React, { Component, PropTypes } from 'react';
import Months from '../constants/Months';

export default class TicketCreated extends Component {
    static propTypes = {
        created: PropTypes.string.isRequired,
        discriminator: PropTypes.string.isRequired
    }
    render() {
        const { created, discriminator } = this.props;
        let creationString = (date) => { return 'Created ' + Months[date.getMonth()] + ' ' + date.getDate(); }(new Date(created));
        creationString += (discriminator == 'github_ticket') ? ' on Github' : ' on Rebase';
        return (
            <span>{creationString}</span>
        );
    }
};
