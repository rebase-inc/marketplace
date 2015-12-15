import React, { Component, PropTypes } from 'react';

import WorkStatus from './WorkStatus.react';
import ProjectInfoPanel from './ProjectInfoPanel.react';
import TitlePanel from './TitlePanel.react';
import TimerPanel from './TimerPanel.react';
import SkillsRequiredPanel from './SkillsRequiredPanel.react';
import { Comment } from './Icons.react';
import ProfilePicture from './ProfilePicture.react';
import { humanReadableDate } from '../utils/date';

import { getContractTicket, getContractWork, getContractComments } from '../utils/getters';

export default class Contract extends Component {
    render() {
        const { contract, select, role, selected } = this.props;
        const ticket = getContractTicket(contract);
        const work = getContractWork(contract);
        return (
            <div className='contract' onClick={select} data-selected={selected || undefined}>
                <div className='status'>
                    <WorkStatus state={work.state} />
                </div>
                <ProfilePicture user={contract.bid.contractor.user} />
                <div className='mainInfo'>
                    <span>{ contract.bid.contractor.user.name }</span>
                    <span>{ ticket.title }</span>
                    { Object.keys(ticket.skill_requirement.skills).map(s => <div key={s} className='skill'>{s}</div>) }
                </div>
                <div className='extraInfo'>
                    <span>{'Finish by'}</span>
                    <span>{ humanReadableDate(contract.bid.auction.finish_work_by, false, true) }</span>
                    <div>
                        <Comment />
                        <span>{getContractComments(contract).length}</span>
                    </div>
                </div>
            </div>
        );
    }
};

