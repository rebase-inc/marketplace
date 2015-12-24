import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import TicketTimeline from './TicketTimeline.react';
import CodeField from './CodeField.react';
import ReviewStatus from './ReviewStatus.react';
import { DISCUSSION, WAITING_FOR_DEV, WAITING_FOR_CLIENT } from '../constants/MediationStates';
import { getReviewTicket } from '../utils/getters';

export default class ReviewHeader extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
        review: PropTypes.object.isRequired,
    }

    render() {
        const { review, role } = this.props;
        const ticket = getReviewTicket(review);
        return (
            <div className='infoHeader'>
                <div className='mainInfo'>
                    <span className='title'>{ticket.title}</span>
                    <ReviewStatus review={review} role={role} />
                </div>
                <div className='otherInfo'>
                    <TicketTimeline role={role} current={'work'} />
                </div>
            </div>
        )
    }
}
