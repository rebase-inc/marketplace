import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Logo, ProfilePicture, Dropdown } from './Icons.react';

import { ViewTypes, ContractorViews, ManagerViews } from '../constants/ViewConstants';
import { PROFILE, PROJECTS, WORK_HISTORY, BILLING_AND_PAYMENTS } from '../constants/ViewConstants';

export default class Sidebar extends Component {
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
        return (
            <div id='sidebar' className='noselect'>
                <Logo />
                <SidebarNav user={user} roles={roles} view={view} views={views} actions={actions} />
                <SidebarProfile actions={actions} user={user} />
            </div>
        );
    }
}

class SidebarNav extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        view: PropTypes.object.isRequired,
        views: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    };

    render() {
        const { user, roles, view, views, actions } = this.props;
        var allViews = [];
        return (
            <div id='sidebarNav'>
                <RoleSelector user={user} role={user.current_role} roles={Array.from(roles.items.values())}/>
                <div id='viewList'>
                    { Array.from(views.items.values()).map(v => <ViewSelection view={v} key={v.type} onSelect={() => actions.selectView(v.type)} selected={v.type == view.type} />) }
                </div>
            </div>
        );
    }
}

class SidebarProfile extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);
        this.state = { optionsOpen: false }
    }

    render() {
        const { user, actions } = this.props;
        return (
            <div id='sidebarProfile'>
                <div id='currentProfile' onClick={() => this.setState({ optionsOpen: !this.state.optionsOpen})}>
                    <ProfilePicture user={user} />
                    <span>{user.first_name + ' ' + user.last_name}</span>
                    <Dropdown />
                </div>
                <ProfileOptions isOpen={this.state.optionsOpen} actions={actions} />
            </div>
       );
    }
}

var ProfileOptions = React.createClass({
    propTypes: {
        isOpen: React.PropTypes.bool.isRequired,
        actions: React.PropTypes.object.isRequired,
    },
    selectOption: function(option) {
        UserActions.selectView(option);
        this.props.toggleOptions();
    },
    render: function() {
        const { isOpen, actions } = this.props;
        return (
            <div id='profileOptions' className={this.props.isOpen ? 'open' : null}>
                <ul>
                    <li onClick={alert.bind(null, PROFILE)}>Profile</li>
                    <li onClick={alert.bind(null, PROJECTS)}>Projects</li>
                    <li onClick={alert.bind(null, WORK_HISTORY)}>Work History</li>
                    <li onClick={alert.bind(null, BILLING_AND_PAYMENTS)}>Billing and Payments</li>
                    <li onClick={actions.logout}>Sign Out</li>
                </ul>
            </div>
        );
    }
});

export class RoleSelector extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
        roles: PropTypes.array.isRequired,
        onSelect: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    render() {
        const { role, roles } = this.props;
        let nonOwnerRoles = roles.filter(r => r.type != 'owner');
        let tableHeight = this.state.open ? 40*(nonOwnerRoles.length) + 'px' : '40px';
        return (
            <div id='roleSelector'
                style={{height: tableHeight}}
                onClick={() => this.setState({ open: !this.state.open })}
                onMouseLeave={() => this.setState({ open: false})}>
                { nonOwnerRoles.map(r => <RoleElement key={r.id} role={r} selected={r.id == role.id} />) }
            </div>
        );
    }
}

let RoleElement = (props) => {
    return (
        <div className={props.selected ? 'selected role' : 'role'} key={props.role.id} onClick={props.select}>
            <div>{ props.role.type == 'manager' ? props.role.project.name : 'Contractor View'}</div>
            { props.role.type == 'manager' ? <div>{props.role.project.organization.name}</div> : null }
        </div>
    );
}

export class ViewSelection extends Component {
    static propTypes = {
        view: PropTypes.object.isRequired,
        onSelect: PropTypes.func.isRequired,
        selected: PropTypes.bool.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.view != this.props.view) || (nextProps.selected != this.props.selected);
    }

    render() {
        const { view, selected, onSelect } = this.props;
        let date = new Date();
        return (
            <div className={selected ? 'viewSelection selected' : 'viewSelection'} onClick={onSelect}>
                <span className='viewIcon'>
                    <img src={view.icon}/>
                </span>
                <span className='viewName'>{view.name}</span>
            </div>
        );
    }
}
