import React, { Component, PropTypes } from 'react';

import StatusPanel from './StatusPanel.react';
import ProjectInfoPanel from './ProjectInfoPanel.react';
import TitlePanel from './TitlePanel.react';
import TimerPanel from './TimerPanel.react';
import SkillsRequiredPanel from './SkillsRequiredPanel.react';
import CommentsPanel from './CommentsPanel.react';
import TalentPanel from './TalentPanel.react';

import { getContractTicket, getContractWork } from '../utils/getters';

export default class Contract extends Component {
    render() {
        const { contract, select, role } = this.props;
        const ticket = getContractTicket(contract);
        const work = getContractWork(contract);
        return (
            <tr className='ticket' onClick={select}>
                <StatusPanel state={work.state} />
                { role.type == 'manager' ? <TalentPanel contractor={contract.bid.contractor} />
                    : <ProjectInfoPanel project={ticket.project} /> }
                <TitlePanel title={ticket.title} />
                <SkillsRequiredPanel skills={ticket.skill_requirement.skills} />
                <TimerPanel expires={contract.bid.auction.finish_work_by} text={'Finish before'}/>
                <CommentsPanel comments={ticket.comments} />
            </tr>
        );
    }
};

