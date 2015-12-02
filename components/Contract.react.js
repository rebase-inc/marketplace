import React, { Component, PropTypes } from 'react';

import StatusPanel from './StatusPanel.react';
import ProjectInfoPanel from './ProjectInfoPanel.react';
import TitlePanel from './TitlePanel.react';
import TimerPanel from './TimerPanel.react';
import SkillsRequiredPanel from './SkillsRequiredPanel.react';
import CommentsPanel from './CommentsPanel.react';
import TalentPanel from './TalentPanel.react';

export default class Contract extends Component {
    render() {
        const { contract, select, role } = this.props;
        return (
            <tr className='ticket' onClick={select}>
                <StatusPanel state={contract.work.state} />
                { role.type == 'manager' ? <TalentPanel contractor={contract.bid.contractor} />
                    : <ProjectInfoPanel project={contract.ticket.project} /> }
                <TitlePanel title={contract.ticket.title} />
                <SkillsRequiredPanel skills={contract.ticket.skill_requirement.skills} />
                <TimerPanel expires={contract.bid.auction.finish_work_by} text={'Finish before'}/>
                <CommentsPanel comments={contract.ticket.comments} />
            </tr>
        );
    }
};

