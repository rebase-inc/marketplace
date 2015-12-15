import React, { Component, PropTypes } from 'react';

import WorkStatus from './WorkStatus.react';
import ProfilePicture from './ProfilePicture.react';

import { getReviewTicket } from '../utils/getters';
import { humanReadableDate } from '../utils/date';

export default class Review extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        review: PropTypes.object.isRequired,
    }
    render() {
        const { review, select, role, selected } = this.props;
        const ticket = getReviewTicket(review);
        return (
            <div className='review' onClick={select} data-selected={selected || undefined}>
                <div className='status'>
                    <WorkStatus state={'complete'} />
                </div>
                <ProfilePicture user={review.work.offer.contractor.user} />
                <div className='mainInfo'>
                    <span>{ review.work.offer.contractor.user.name }</span>
                    <span>{ ticket.title }</span>
                </div>
                <div className='extraInfo'>
                    <span>{'Finished on'}</span>
                    <span>{ humanReadableDate(review.created, false, true) }</span>
                </div>
            </div>
        );
        return (
            <tr className='ticket' onClick={select}>
                { role.type == 'manager' ? <DebitPanel debit={review.work.debit} /> : null }
                <ReviewPanel review={review} />
                <DatePanel text={'Finished'} date={review.created} />
                <TitlePanel title={ticket.title} />
                <SkillsRequiredPanel skills={ticket.skill_requirement.skills} />
                <CommentsPanel comments={ticket.comments} />
            </tr>
        );
    }
};
