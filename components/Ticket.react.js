import React, { Component, PropTypes } from 'react';

import FindTalentPanel from './FindTalentPanel.react';
import { Comment } from './Icons.react';

const MonthNames = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default class Ticket extends Component {
    render() {
        const { ticket } = this.props;
        return (
            <tr className='ticket'>
                <DatePanel text={'Created'} date={ticket.created} />
                <TitlePanel text={ticket.title} />
                <SkillsRequiredPanel skills={ticket.skill_requirement.skills} />
                <SpacerPanel />
                <CommentsPanel comments={ticket.comments} />
            </tr>
        );
    }
};

class DatePanel extends Component {
    render() {
        const { text, date } = this.props;
        let dateString = (date) => { return MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(date));
        return (
            <td className='datePanel'>
                <span>{text}</span>
                <span>{dateString}</span>
            </td>
        );
    }
}

class TitlePanel extends Component {
    render() {
        return (
            <td className='titlePanel'>
                <span>{this.props.text}</span>
            </td>
        );
    }
}

class SkillsRequiredPanel extends Component {
    render() {
        const { skills } = this.props;
        return (
            <td className='skillsRequiredPanel'>
                <div className='skills'>
                    { Object.keys(skills).map(s => <div key={s} className='skill'>{s}</div>) }
                </div>
            </td>
        );
    }
}

class CommentsPanel extends Component {
    render() {
       const { comments } = this.props;
       return (
            <td className='commentsPanel'>
                <Comment/>
                <span>{comments.length} Comments</span>
            </td>
       );
    }
}

// This problem can almost certainly be solved with CSS
class SpacerPanel extends Component {
    render() { return <td className='spacerPanel'/> }
}

module.exports = Ticket;
