import React, { Component, PropTypes } from 'react';

export default class StatusPanel extends Component {
    static propTypes = { state: PropTypes.string.isRequired }
    render() {
        const { state } = this.props;
        return <td
            className='statusPanel'
            data-neutral={undefined}
            data-notification={state == 'in_progress' || undefined}
            data-okay={state == 'in_review' || undefined}
            data-alert={state == 'blocked' || state == 'in_mediation' || undefined}
            data-warning={undefined} />;
    }
}
