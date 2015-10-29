import React, { Component, PropTypes } from 'react';

import StatusPanel from './StatusPanel.react';
import ProjectInfoPanel from './ProjectInfoPanel.react';
import TitlePanel from './TitlePanel.react';
import SkillsRequiredPanel from './SkillsRequiredPanel.react';
import CommentsPanel from './CommentsPanel.react';

export default class Contract extends Component {
    render() {
        const { contract, select } = this.props;
        return (
            <tr className='ticket' onClick={select}>
                <StatusPanel state={contract.work.state} />
                <ProjectInfoPanel project={contract.ticket.project} />
                <TitlePanel title={contract.ticket.title} />
                <SkillsRequiredPanel skills={contract.ticket.skill_requirement.skills} />
                <CommentsPanel comments={contract.ticket.comments} />
            </tr>
        );
    }
};

