import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';

import TicketStatus from './TicketStatus.react';
import GithubIcon from './GithubIcon.react';
import { Comment } from './Icons.react';
import { humanReadableDate } from '../utils/date';

const CommentDetails = (props) => (
    <div>
        <Comment />
        <span>{props.comments.length}</span>
    </div>
);

const Ticket = (props) => (
    <ListElement {...props}
        date={humanReadableDate(props.created, false, true)}
        icon={props.discriminator == 'github_ticket' ? <GithubIcon /> : <TicketStatus {...props} />}
        subtitle={ Object.keys(props.skill_requirement.skills).join(' ') }
        extra={<CommentDetails {...props}/>}
        />
);

export default Ticket;
