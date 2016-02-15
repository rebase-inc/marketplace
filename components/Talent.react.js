import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';
import ScoredProfilePicture from './ScoredProfilePicture.react';
import RatingStars from './RatingStars.react';
import ApproveIcon from './ApproveIcon.react';

const Talent = (props) => (
    <ListElement 
        className={'talent'}
        title={props.nomination.contractor.user.name}
        subtitle={ Object.keys(props.nomination.contractor.skill_set.skills).join(' ') }
        date={<RatingStars rating={props.nomination.contractor.rating ? props.nomination.contractor.rating / 2 : 3.5} />}
        icon={<ScoredProfilePicture user={props.nomination.contractor.user} score={props.nomination.job_fit ? props.nomination.job_fit.score : null} />}
        hidden={<ApproveIcon onClick={props.approve} />}
        />
);

export default Talent;
