import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProfilePicture from './ProfilePicture.react';
import DropdownMenu from './DropdownMenu.react';
import { Logo, Dropdown } from './Icons.react';

import { ViewTypes, ContractorViews, ManagerViews } from '../constants/ViewConstants';
import { PROFILE, PROJECTS, DEVELOPER_PROFILE, BILLING_AND_PAYMENTS } from '../constants/ViewConstants';

export default class MainHeader extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        view: PropTypes.object.isRequired,
        views: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { user, roles, view, views, actions } = this.props;
        let filteredRoles = Array.from(roles.items.values()).filter(r => r.type != 'owner'); // hack to deal with owner roles
        return (
            <div id='mainHeader' className='noselect'>
                <Logo />
                <ViewList view={view} views={Array.from(views.items.values())} selectView={actions.selectView} />
                <ProjectSelector user={user} role={user.current_role} selectRole={(role) => actions.selectRole(user, role.id)} roles={filteredRoles}/>
                <ProfileOptions actions={actions} user={user} />
            </div>
        );
        return (
            <div id='mainHeader' className='noselect'>
                <Logo />
                <SidebarNav user={user} roles={roles} view={view} views={views} actions={actions} />
                <SidebarProfile actions={actions} user={user} />
            </div>
        );
    }
}

class ViewList extends Component {
    static propTypes = {
        view: PropTypes.object.isRequired,
        views: PropTypes.array.isRequired,
        selectView: PropTypes.func.isRequired,
    }
    render() {
        const { view, views, selectView } = this.props;
        return (
            <div id='viewList'>
                { views.map(v => <ViewSelection key={v.type} select={() => selectView(v.type)} selected={v.type == view.type} name={v.name} />) }
            </div>
        )
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
        const { user, actions } = this.props;
        return (
            <div id='profileOptions' onMouseEnter={this.open} onMouseLeave={this.close} data-open={this.state.open}>
                <CurrentProfile user={user} />
                { this.state.open ? 
                    <DropdownMenu> 
                        <div className='option' onClick={() => actions.selectView(PROFILE)}>Profile</div>
                        <div className='option' onClick={() => actions.selectView(PROJECTS)}>Projects</div>
                        <div className='option' onClick={() => actions.selectView(DEVELOPER_PROFILE)}>Developer Profile</div>
                        <div className='option' onClick={() => actions.selectView(BILLING_AND_PAYMENTS)}>Billing and Payments</div>
                        <div className='option' onClick={actions.logout}>Sign Out</div>
                    </DropdownMenu> : null }
            </div>
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
                <div>{user.first_name + ' ' + user.last_name}</div>
            </div>
        );
    }
}

export class ProjectSelector extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
        roles: PropTypes.array.isRequired,
        selectRole: PropTypes.func.isRequired,
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
        const { role, roles, selectRole } = this.props;
        let selectedRole = roles.find(r => r.id == role.id);
        let otherRoles = roles.filter(r => r.id != role.id);
        return (
            <div id='projectSelector' onMouseOver={this.open} onMouseLeave={this.close} data-open={this.state.open}>
                <Role key={selectedRole.id} role={selectedRole} selected={true} />
                { this.state.open ? 
                    <DropdownMenu> 
                        { otherRoles.map(r => <Role key={r.id} role={r} select={() => selectRole(r)} selected={false} />) }
                        { otherRoles.length ? null : <div className='role'><span style={{fontSize: '12px'}}>no other projects</span></div> }
                    </DropdownMenu> : null }
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

