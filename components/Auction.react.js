import React, { Component, PropTypes } from 'react';

import FindTalentPanel from './FindTalentPanel.react';
import TitlePanel from './TitlePanel.react';
import TimerPanel from './TimerPanel.react';
import BudgetPanel from './BudgetPanel.react';
import CommentsPanel from './CommentsPanel.react';
import ProjectInfoPanel from './ProjectInfoPanel.react';
import SkillsRequiredPanel from './SkillsRequiredPanel.react';
import TalentOverviewPanel from './TalentOverviewPanel.react';

import { getAuctionTicket } from '../utils/getters';

// Effectively just a passthrough component based on current role
export default class Auction extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        role: PropTypes.object.isRequired,
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { role, auction, select } = this.props;
        switch (role.type) {
            case 'manager': return <ManagerViewAuction auction={auction} select={select} />; break;
            case 'contractor': return <DeveloperViewAuction auction={auction} select={select} />; break;
        }
    }
}

export class DeveloperViewAuction extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { auction, select } = this.props;
        const ticket = getAuctionTicket(auction);
        return (
            <tr className='auction' onClick={select}>
                <ProjectInfoPanel project={ticket.project} />
                <TitlePanel title={ticket.title} />
                <SkillsRequiredPanel skills={ticket.skill_requirement.skills} />
                <TimerPanel text='Auction Ends' expires={auction.expires} />
                <CommentsPanel comments={ticket.comments} />
            </tr>
        );
    }
};

export class ManagerViewAuction extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { auction, select } = this.props;
        const ticket = getAuctionTicket(auction);
        return (
            <tr className='auction' onClick={select}>
                <TimerPanel text='Auction Ends' expires={auction.expires} />
                <TitlePanel title={ticket.title} />
                <TalentOverviewPanel auction={auction} />
                <SkillsRequiredPanel skills={ticket.skill_requirement.skills} />
                <BudgetPanel auction={auction} />
            </tr>
        );
    }
};
