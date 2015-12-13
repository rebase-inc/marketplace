import React, { Component, PropTypes } from 'react';

import TitlePanel from './TitlePanel.react';
import ReviewPanel from './ReviewPanel.react';
import CommentsPanel from './CommentsPanel.react';
import ProjectInfoPanel from './ProjectInfoPanel.react';
import DebitPanel from './DebitPanel.react';
import DatePanel from './DatePanel.react';
import SkillsRequiredPanel from './SkillsRequiredPanel.react';

import { getReviewTicket } from '../utils/getters';

export default class Review extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        review: PropTypes.object.isRequired,
    }
    render() {
        const { review, select, role } = this.props;
        const ticket = getReviewTicket(review);
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
