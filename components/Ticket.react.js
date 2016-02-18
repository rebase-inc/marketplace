import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';

import TicketStatus from './TicketStatus.react';
import GithubIcon from './GithubIcon.react';
import CommentIcon from './CommentIcon.react';
import { humanReadableDate } from '../utils/date';

const CommentDetails = (props) => (
    <div>
        <span>{props.comments.length}</span>
        <CommentIcon />
    </div>
);

const Ticket = (props) => (
    <ListElement {...props}
        subtitle={Object.keys(props.skill_requirement.skills).join(' ')}
        prefix={'Created on ' + (props.discriminator == 'github_ticket' ? 'GitHub' : 'Rebase')}
        info={props.comments.length + ' · ' + humanReadableDate(props.created, false, true)}
        icon={<TicketStatus {...props}/>}
        />
);

export default Ticket;
