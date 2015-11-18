import React, { Component, PropTypes } from 'react';

export default class StatusPanel extends Component {
    static propTypes = { state: PropTypes.string.isRequired }
    render() {
        const { state } = this.props;
        return <td 
            className='statusPanel'
            data-warning={state == 'in_mediation' || undefined}
            data-alert={state == 'blocked' || undefined}
            data-notification={state == 'in_review' || undefined}
            data-okay={state == 'in_progress' || undefined} />;
    }
}
