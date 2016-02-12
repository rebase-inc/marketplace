import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';

import RoundIcon from './RoundIcon.react';
import GithubIcon from './GithubIcon.react';

const Ticket = (props) => (
    <ListElement {...props} date={props.created}
        icon={props.discriminator == 'github_ticket' ? <GithubIcon /> : <RoundIcon />}
        subtitle={ Object.keys(props.skill_requirement.skills).join(' ') } />
);

export default Ticket;
