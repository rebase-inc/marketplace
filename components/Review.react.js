import React, { Component, PropTypes } from 'react';

import WorkStatus from './WorkStatus.react';
import ProfilePicture from './ProfilePicture.react';

import { getReviewTicket } from '../utils/getters';
import { humanReadableDate } from '../utils/date';
import ListElement from './ListElement.react';

const Review = (props) => (
    <ListElement {...getReviewTicket(props)} {...props}
        prefix={'Finished on ' + humanReadableDate(props.created)}
        info={'$666'}
        icon={null}
        subtitle={Object.keys(getReviewTicket(props).skill_requirement.skills).join(' ')}
        />
);

export default Review;
