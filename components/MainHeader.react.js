import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProfilePicture from './ProfilePicture.react';
import DropdownMenu from './DropdownMenu.react';
import ViewSelector from './ViewSelector.react';
import { Logo, Dropdown } from './Icons.react';

import { ViewTypes, ContractorViews, ManagerViews } from '../constants/ViewConstants';
import { PROFILE, PROJECTS, DEVELOPER_PROFILE, BILLING_AND_PAYMENTS } from '../constants/ViewConstants';

import WalkthroughStep from './WalkthroughStep.react';

import * as WalkthroughConstants from '../constants/WalkthroughConstants';

import Tooltip from 'rc-tooltip';

export default class MainHeader extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        view: PropTypes.object.isRequired,
        views: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        walkthrough: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { user, walkthrough, roles, view, views, actions, walkthroughActions } = this.props;
        let filteredRoles = Array.from(roles.items.values()).filter(r => r.type != 'owner'); // hack to deal with owner roles
        const role = roles.items.get(user.current_role.id); 
        const otherProps = { walkthrough, walkthroughActions, role, view };
        return (
            <div id='mainHeader' className='noselect'>
                <ViewSelector views={Array.from(views.items.values())} selectView={actions.selectView} {...otherProps} />
                <ProjectSelector
                    openProjectSelectionModal={actions.openProjectSelectionModal}
                    role={user.current_role}
                    roles={filteredRoles}
                />
                <ProfileOptions actions={actions} user={user} {...otherProps} />
            </div>
        );
    }
}

class ViewSelection extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        select: PropTypes.func.isRequired,
        selected: PropTypes.bool.isRequired,
    }

    render() {
        const { name, select, selected } = this.props;
        return <div onClick={select} data-selected={selected}>{name}</div>;
    }
}

class ProfileOptions extends Component {
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

export const ProfileWalkthrough = (props) => (
    <div className='walkthroughStep'>
        <h3>Your Profile</h3>
        <h4>Manage all of your personal settings, including personal details, integrations, and banking information.</h4>
        <div className='buttons'>
            <button data-quiet onClick={props.previousStep}>Back</button>
            <button data-notification onClick={props.exit}>Exit</button>
            <button data-okay onClick={props.nextStep}>Next</button>
        </div>
    </div>
);

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

export class ProjectSelector extends Component {
    static propTypes = {
        openProjectSelectionModal: PropTypes.func.isRequired,
        role: PropTypes.object.isRequired,
        roles: PropTypes.array.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { openProjectSelectionModal, role, roles } = this.props;
        let selectedRole = roles.find(r => r.id == role.id);
        return (
            <div id='projectSelector' onClick={openProjectSelectionModal} >
                <Role key={selectedRole.id} role={selectedRole} selected={true} />
            </div>
        );
    }
}

class Role extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
        selected: PropTypes.bool.isRequired,
        select: PropTypes.func,
    }
    render() {
        const { role, selected, select } = this.props;
        return (
            <div className='role' data-selected={selected} onClick={select}>
                <span>{ role.type == 'manager' ? role.project.name : 'Developer View'}</span>
                { role.type == 'manager' ? <span>{role.project.organization.name}</span> : null }
            </div>
        );
    }
}

