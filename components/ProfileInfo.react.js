import React, { Component, PropTypes } from 'react';

import Tooltip from 'rc-tooltip';

import DropdownMenu from './DropdownMenu.react';
import WalkthroughStep from './WalkthroughStep.react';
import ProfilePicture from './ProfilePicture.react';
import SettingsIcon from './SettingsIcon.react';

import { PROFILE, PROJECTS, DEVELOPER_PROFILE, BILLING_AND_PAYMENTS } from '../constants/ViewConstants';
import * as WalkthroughConstants from '../constants/WalkthroughConstants';

export default class ProfileInfo extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    }

    render() {
        const { user, actions, walkthrough, walkthroughActions } = this.props;
        const walkthroughProps = { 
            role_id: user.current_role.id,
            title: 'Your Profile', 
            description: 'Manage all of your personal settings, including personal details, integrations, and banking information.',
            walkthrough,
            ...walkthroughActions,
        };
        const tooltipVisible = walkthrough.steps[walkthrough.current] == WalkthroughConstants.PROFILE;
        return (
            <Tooltip visible={tooltipVisible} overlay={<WalkthroughStep {...walkthroughProps} />} placement='bottomLeft'>
                <div id='profileInfo'>
                    <ProfilePicture user={user} />
                    <div className='name'>{user.name}</div>
                    <SettingsIcon onClick={actions.selectView.bind(null, PROFILE)} />
                </div>
            </Tooltip>
       );
    }
}
