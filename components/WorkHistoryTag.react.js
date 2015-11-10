import React, { Component, PropTypes } from 'react';

import { GithubLogo, X } from './Icons.react';

export default class WorkHistoryTag extends Component {
    render() {
        let { project, organization } = this.props;
        return (
            <div className='workHistoryTag'>
                <GithubLogo />
                <div className='title'>
                    { project }
                    { organization }
                </div>
                <X />
            </div>
        );
    }
};
