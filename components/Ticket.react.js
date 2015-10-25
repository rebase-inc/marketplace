import React, { Component, PropTypes } from 'react';

import FindTalentPanel from './FindTalentPanel.react';
import SkillsRequiredPanel from './SkillsRequiredPanel.react';
import DatePanel from './DatePanel.react';
import TitlePanel from './TitlePanel.react';
import CommentsPanel from './CommentsPanel.react';

export default class Ticket extends Component {
    render() {
        const { ticket } = this.props;
        return (
            <tr className='ticket'>
                <DatePanel text={'Created'} date={ticket.created} />
                <TitlePanel title={ticket.title} />
                <SkillsRequiredPanel skills={ticket.skill_requirement.skills} />
                <SpacerPanel />
                <CommentsPanel comments={ticket.comments} />
            </tr>
        );
    }
};

// This problem can almost certainly be solved with CSS
class SpacerPanel extends Component {
    render() { return <td className='spacerPanel'/> }
}
