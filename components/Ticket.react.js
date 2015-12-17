import React, { Component, PropTypes } from 'react';

import ProfilePicture from './ProfilePicture.react';
import { Comment } from './Icons.react';
import RebaseIcon from './RebaseIcon.react';
import GithubIcon from './GithubIcon.react';

import { humanReadableDate } from '../utils/date';

export default class Ticket extends Component {
    static propTypes = {
        ticket: PropTypes.object.isRequired,
        select: PropTypes.func.isRequired,
    }
    render() {
        const { ticket, select, selected } = this.props;
        return (
            <div className='ticket' onClick={select} data-selected={selected || undefined}>
                <div className='createdOn'>
                    { ticket.discriminator == 'github_ticket' ? <GithubIcon /> : <RebaseIcon /> }
                </div>
                <div className='mainInfo'>
                    <div className='skills'>
                        { Object.keys(ticket.skill_requirement.skills).join(', ') }
                    </div>
                    <span className='title'>{ ticket.title }</span>
                </div>
                <div className='extraInfo'>
                    <span>{humanReadableDate(ticket.created, false, true)}</span>
                    <div>
                        <Comment />
                        <span>{ticket.comments.length}</span>
                    </div>
                </div>
            </div>
        );
    }
};

export const GithubTicketLink = (props) => {
    const url = 'https://github.com/' + props.ticket.project.organization.name + '/' + props.ticket.project.name;
    return <span className='link' onClick={window.open(url)}>{'View on GitHub'}</span>;
}

export const RebaseTicketLink = (props) => {
    return <span className='link'>{'Created on Rebase'}</span>;
}
