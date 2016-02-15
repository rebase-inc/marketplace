import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';

import TicketStatus from './TicketStatus.react';
import GithubIcon from './GithubIcon.react';

const Ticket = (props) => (
    <ListElement {...props} date={props.created}
        icon={props.discriminator == 'github_ticket' ? <GithubIcon /> : <TicketStatus {...props} />}
        subtitle={ Object.keys(props.skill_requirement.skills).join(' ') } />
);

export default Ticket;
