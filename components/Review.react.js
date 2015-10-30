import React, { Component, PropTypes } from 'react';

import TitlePanel from './TitlePanel.react';
import CommentsPanel from './CommentsPanel.react';
import ProjectInfoPanel from './ProjectInfoPanel.react';
import SkillsRequiredPanel from './SkillsRequiredPanel.react';

export default class Review extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        review: PropTypes.object.isRequired,
    }
    render() {
        const { review, select } = this.props;
        return (
            <tr className='ticket' onClick={select}>
                <ProjectInfoPanel project={review.ticket.project} />
                <TitlePanel title={review.ticket.title} />
                <SkillsRequiredPanel skills={review.ticket.skill_requirement.skills} />
                <CommentsPanel comments={review.ticket.comments} />
            </tr>
        );
    }
};
