import React, { Component, PropTypes } from 'react';

import Tooltip from 'rc-tooltip';

import DropdownMenu from './DropdownMenu.react';
import WalkthroughStep from './WalkthroughStep.react';
import ProfilePicture from './ProfilePicture.react';

import { PROFILE, PROJECTS, DEVELOPER_PROFILE, BILLING_AND_PAYMENTS } from '../constants/ViewConstants';
import * as WalkthroughConstants from '../constants/WalkthroughConstants';

export default class ProfileOptions extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = { open: false };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    open() {
        this.setState({ open: true });
    }

    close() {
        this.setState({ open: false });
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
                <div id='profileOptions' onMouseEnter={this.open} onMouseLeave={this.close} data-open={this.state.open}>
                    <CurrentProfile user={user} />
                    { this.state.open ?
                        <DropdownMenu>
                            <div className='option' onClick={() => actions.selectView(PROFILE)}>Profile</div>
                            { user.current_role.type == 'manager' ? <div className='option' onClick={() => actions.selectView(PROJECTS)}>Projects</div> : null }
                            { user.current_role.type == 'contractor' ? <div className='option' onClick={() => actions.selectView(DEVELOPER_PROFILE)}>Developer Profile</div> : null }
                            <div className='option' onClick={actions.logout}>Sign Out</div>
                        </DropdownMenu> : null }
                </div>
            </Tooltip>
       );
    }
}

class CurrentProfile extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    render() {
        const { user } = this.props;
        return (
            <div id='currentProfile' className='option'>
                <ProfilePicture user={user} />
                <div>{user.name}</div>
            </div>
        );
    }
}

