import React, { Component, PropTypes } from 'react';

import WorkStatus from './WorkStatus.react';
import ProfilePicture from './ProfilePicture.react';

import { getReviewTicket } from '../utils/getters';
import { humanReadableDate } from '../utils/date';
import ListElement from './ListElement.react';

const Review = function(props) {
    let price = !!props.work.credit ? props.work.credit.price : props.work.debit.price;
    price = '$'+price.toString();
    return <ListElement {...getReviewTicket(props)} {...props}
        prefix={'Finished on ' + humanReadableDate(props.created)}
        info={price}
        icon={null}
        subtitle={Object.keys(getReviewTicket(props).skill_requirement.skills).join(' ')}
        />
};

export default Review;
