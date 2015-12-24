import React, { Component, PropTypes } from 'react';

import ManagerTicketTimeline from './ManagerTicketTimeline.react';
import DeveloperTicketTimeline from './DeveloperTicketTimeline.react';

export default class TicketTimeline extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
        current: PropTypes.oneOf(['create', 'auction', 'work', 'review']).isRequired,
    }

    render() {
        const { role, current } = this.props;
        switch (role.type) {
            case 'manager': return <ManagerTicketTimeline current={current} />; break;
            default: return <DeveloperTicketTimeline current={current} />; break;
        }
    }
}
