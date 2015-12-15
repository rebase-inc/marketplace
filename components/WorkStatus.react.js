import React, { Component, PropTypes } from 'react';

export default class WorkStatus extends Component {
    static propTypes = { state: PropTypes.string.isRequired }
    render() {
        const { state } = this.props;
        return (
            <svg height='12px' width='12px' viewBox='0 0 12 12'
                className='workStatus'
                data-neutral={undefined}
                data-notification={state == 'in_progress' || undefined}
                data-okay={state == 'in_review' || undefined}
                data-alert={state == 'blocked' || state == 'in_mediation' || undefined}
                data-warning={undefined}>
                <circle cx='6' cy='6' r='6' />
            </svg>
        )
    }
}
