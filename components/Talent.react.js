import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';
import ScoredProfilePicture from './ScoredProfilePicture.react';
import RatingStars from './RatingStars.react';
import ApproveTalentIcon from './ApproveTalentIcon.react';

const Talent = (props) => (
    <ListElement title={props.nomination.contractor.user.name}
        subtitle={ Object.keys(props.nomination.contractor.skill_set.skills).join(' ') }
        date={''}
        icon={<ScoredProfilePicture user={props.nomination.contractor.user} score={props.nomination.job_fit ? props.nomination.job_fit.score : null} />}
        extra={<ApproveTalentIcon {...props} />}
        />
);

export default Talent;
