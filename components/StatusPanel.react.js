import React, { Component, PropTypes } from 'react';

export default class StatusPanel extends Component {
    static propTypes = { state: PropTypes.string.isRequired }
    render() {
        let className = { 
            in_progress: 'neutral', 
            in_review: 'notification', 
            blocked: 'needsResolution',
            in_mediation: 'needsResolution',
        }[this.props.state] || 'neutral';
        return <td className={'statusPanel ' + className} />;
    }
}
