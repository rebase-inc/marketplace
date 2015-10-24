import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Logo, ProfilePicture } from './Icons.react';

import UserActions from '../actions/UserActions';
import ManagerActions from '../actions/ManagerActions';

import { ViewTypes, ContractorViews, ManagerViews } from '../constants/ViewConstants';

export default class Sidebar extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
    };

    render() {
        const { user, roles } = this.props;
        return (
            <div id='sidebar' className='noselect'>
                <Logo />
                <SidebarNav user={user} roles={roles} />
            </div>
        );
    }
}

class SidebarNav extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
    };

    render() {
        const { user, roles } = this.props;
        var allViews = [];
        console.log('in sidebar nav, user is ', user);
        switch (user.current_role.type) {
            case 'contractor':
                allViews.push(<ViewSelection view={ContractorViews[ViewTypes.OFFERED]} key='dev0'/>);
                allViews.push(<ViewSelection view={ContractorViews[ViewTypes.IN_PROGRESS]} key='dev1'/>);
                allViews.push(<ViewSelection view={ContractorViews[ViewTypes.COMPLETED]} key='dev2' />);
            break;
            case 'manager':
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.NEW]} key='man0' />);
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.OFFERED]} key='man1' />);
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.IN_PROGRESS]} key='man2' />);
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.COMPLETED]} key='man3' />);
            break;
        }
        return (
            <div id='sidebarNav'>
                <RoleSelector user={user} role={user.current_role} roles={roles.items}/>
                <div id='viewList'>
                    { allViews }
                </div>
            </div>
        );
    }
}

var SidebarProfile = React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired,
    },
    getInitialState: () => ({ optionsOpen: false }),
    render: function() {
        const { user } = this.props;
        return (
            <div id='sidebarProfile'>
                <div id='currentProfile' onClick={() => this.setState({ optionsOpen: !this.state.optionsOpen})}>
                    <ProfilePicture user={user} />
                    <span>{user.first_name + ' ' + user.last_name}</span>
                    <Dropdown />
                </div>
                <ProfileOptions isOpen={this.state.optionsOpen} />
            </div>
       );
    }
});

var ProfileOptions = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        isOpen: React.PropTypes.bool.isRequired,
    },
    selectOption: function(option) {
        UserActions.selectView(option);
        this.props.toggleOptions();
    },
    render: function() {
        return (
            <div id='profileOptions' className={this.props.isOpen ? 'open' : null}>
                <ul>
                    <li onClick={this.selectOption.bind(null, ViewTypes.PROFILE)}>Profile</li>
                    <li onClick={this.selectOption.bind(null, ViewTypes.PROJECTS)}>Projects</li>
                    <li onClick={this.selectOption.bind(null, ViewTypes.WORK_HISTORY)}>Work History</li>
                    <li onClick={this.selectOption.bind(null, ViewTypes.BILLING_AND_PAYMENTS)}>Billing and Payments</li>
                    <li onClick={UserActions.logout}>Sign Out</li>
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
        selected: PropTypes.bool.isRequired,
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
                { nonOwnerRoles.map(r => <RoleElement role={r} selected={r.id == role.id} />) }
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

    render() {
        const { view, selected, onSelect } = this.props;
        return (
            <div className={'viewSelection' + (selected ? ' selected' : '')} onClick={onSelect}>
                <span className='viewIcon'>
                    <img src={view.icon}/>
                </span>
                <span className='viewName'>{view.name}</span>
            </div>
        );
    }
}
