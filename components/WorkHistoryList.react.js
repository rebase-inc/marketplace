import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import WorkHistoryTag from './WorkHistoryTag.react';

export default class WorkHistoryList extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        contractor: PropTypes.object.isRequired,
    }

    render() {
        let githubAccounts = [
            { project: 'api', organization: 'rebase'},
            { project: 'marketing', organization: 'rebase'},
            { project: 'models', organization: 'rebase'},
            { project: 'redux', organization: 'rackt'},
        ];
        return (
            <div className='workHistoryList'>
                { githubAccounts.map(ga => <WorkHistoryTag project={ga.project} organization={ga.organization} />) }
            </div>
        );
    }
};
