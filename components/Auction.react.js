import React, { Component, PropTypes } from 'react';

import FindTalentPanel from './FindTalentPanel.react';
import TitlePanel from './TitlePanel.react';
import TimerPanel from './TimerPanel.react';
import BudgetPanel from './BudgetPanel.react';
import SkillsRequiredPanel from './SkillsRequiredPanel.react';
import TalentOverviewPanel from './TalentOverviewPanel.react';

export default class Auction extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { roles, user, auction } = this.props;
        switch (roles.items.get(user.current_role.id).type) {
            case 'manager': return <ManagerViewAuction {...this.props} />; break;
            case 'contractor': return <DeveloperViewAuction {...this.props} />; break;
        }
    }
}

export class DeveloperViewAuction extends Component {
    static propTypes = {
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { auction } = this.props;
        return (
            <tr className='auction'>
                <ProjectInfoPanel project={auction.ticket.project} />
                <TitlePanel title={auction.ticket.title} />
                <SkillsRequiredPanel skills={auction.ticket.skill_requirement.skills} />
                <CommentsPanel comments={auction.ticket.comments} />
            </tr>
        );
    }
};

export class ManagerViewAuction extends Component {
    static propTypes = {
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { auction } = this.props;
        return (
            <tr className='auction'>
                <TimerPanel text='Auction Ends' expires={auction.expires} />
                <TitlePanel title={auction.ticket.title} />
                <TalentOverviewPanel auction={auction} />
                <SkillsRequiredPanel skills={auction.ticket.skill_requirement.skills} />
                <BudgetPanel auction={auction} />
            </tr>
        );
    }
};