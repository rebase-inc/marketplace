import React, { Component, PropTypes } from 'react';

import ProfilePicture from './ProfilePicture.react';
import { Comment } from './Icons.react';

import { humanReadableDate } from '../utils/date';

export default class Ticket extends Component {
    static propTypes = {
        ticket: PropTypes.object.isRequired,
        select: PropTypes.func.isRequired,
    }
    render() {
        const { ticket, select, selected } = this.props;
        return (
            <div className='ticket' onClick={select} data-selected={selected || undefined}>
                <div className='mainInfo'>
                    <span>{ ticket.title }</span>
                    { Object.keys(ticket.skill_requirement.skills).map(s => <div key={s} className='skill'>{s}</div>) }
                </div>
                <div className='extraInfo'>
                    <span>{'Created ' + humanReadableDate(ticket.created, false, true)}</span>
                    <div>
                        <Comment />
                        <span>{ticket.comments.length}</span>
                    </div>
                </div>
            </div>
        );
    }
};

// This problem can almost certainly be solved with CSS
class SpacerPanel extends Component {
    render() { return <td className='spacerPanel'/> }
}
