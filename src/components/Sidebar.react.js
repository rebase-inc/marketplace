// External
var React = require('react');
var _ = require('underscore');

// Components
var Icons = require('../components/Icons.react');

// Actions
var UserActions = require('../actions/UserActions');
var ManagerActions = require('../actions/ManagerActions');

// Constants
var ViewTypes = require('../constants/ViewConstants').ViewTypes;
var ContractorViews = require('../constants/ViewConstants').ContractorViews;
var ManagerViews = require('../constants/ViewConstants').ManagerViews;


var Sidebar = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        currentView: React.PropTypes.object.isRequired,
        selectRole: React.PropTypes.func.isRequired,
    },
    render: function() {
        return (
            <div id='sidebar' className='noselect'>
                <img className='logo' src='img/logo.svg' alt='Rebase Logo'/>
                <SidebarNav {...this.props} />
                <SidebarProfile currentUser={this.props.currentUser} />
            </div>
        );
    }
});

var SidebarNav = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        currentView: React.PropTypes.object.isRequired,
        selectRole: React.PropTypes.func.isRequired,
    },
    render: function() {
        var viewProps = {
            currentView: this.props.currentView,
        }
        var roleProps = {
            currentUser: this.props.currentUser,
            currentRole: this.props.currentRole,
            selectRole: this.props.selectRole,
        }
        var allViews = [];
        // the views are pushed explicitly, because javascript implementations don't guarantee object key order
        // so a map or similar operation cannot be used. Probably should switch to storing the data in array, then.
        // That would also allow for dynamic generation of the keys (dev0, man0, etc).
        switch (this.props.currentRole.type) {
            case 'contractor':
                allViews.push(<ViewSelection view={ContractorViews[ViewTypes.OFFERED]} {...viewProps} key='dev0'/>);
                allViews.push(<ViewSelection view={ContractorViews[ViewTypes.IN_PROGRESS]} {...viewProps} key='dev1'/>);
                allViews.push(<ViewSelection view={ContractorViews[ViewTypes.COMPLETED]} {...viewProps} key='dev2' />);
            break;
            case 'manager':
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.NEW]} {...viewProps} key='man0' />);
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.OFFERED]} {...viewProps} key='man1' />);
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.IN_PROGRESS]} {...viewProps} key='man2' />);
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.COMPLETED]} {...viewProps} key='man3' />);
            break;
        }
        return (
            <div id='sidebarNav'>
                <RoleSelector {...roleProps} />
                <div id='viewList'>
                    { allViews }
                </div>
            </div>
        );
    }
});

var SidebarProfile = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return { optionsOpen: false };
    },
    toggleOptions: function() {
        this.setState({ optionsOpen: !this.state.optionsOpen });
    },
    render: function() {
        return (
            <div id='sidebarProfile'>
                <div id='currentProfile' onClick={this.toggleOptions}>
                    <Icons.ProfilePicture user={this.props.currentUser} />
                    <span>{this.props.currentUser.first_name + ' ' + this.props.currentUser.last_name}</span>
                    <Icons.Dropdown />
                </div>
                <ProfileOptions isOpen={this.state.optionsOpen} toggleOptions={this.toggleOptions} {...this.props} />
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

var RoleSelector = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        selectRole: React.PropTypes.func.isRequired,
    },
    getInitialState: () => ({ open: false }),
    toggleDropdown: function() {
        this.setState({ open: !this.state.open })
    },
    render: function() {
        let dropdown = <RoleSelectorDropdown selectRole={this.props.selectRole.bind(null, this.props.currentUser)} roles={this.props.currentUser.roles} />;
        return (
            <div id='roleSelector' className={this.state.open ? 'open' : ''} onClick={this.toggleDropdown}>
                <span>{ this.props.currentRole.type == 'manager' ? this.props.currentRole.project.name : this.props.currentRole.type }</span>
            <Icons.Dropdown />
            { !!this.state.open ? dropdown : null }
            </div>
        );
    }
});

let RoleSelectorDropdown = (props) => {
    return (
        <div id='roleSelectorDropdown'>
            <ul>
                { props.roles.map((role) => <RoleSelection selectRole={props.selectRole.bind(null, role.id)} role={role} />) }
            </ul>
        </div>
    );
}

let RoleSelection = (props) => {
    let className = props.role == props.currentRole ? 'selected' : '';
    return (
        <li className={className} key={props.role.id} onClick={props.selectRole.bind(null, props.role.id)}>
            { props.role.type == 'manager' ? props.role.project.name : props.role.type }
        </li>
    );
}

var ViewSelection = React.createClass({
    render: function() {
        var className = 'viewSelection';
        if (this.props.view == this.props.currentView) { className = className + ' selected'; }
        return (
            <div className={className} onClick={UserActions.selectView.bind(null, this.props.view.type)}>
            <span className='viewIcon'>
            <img src={this.props.view.icon}/>
            </span>
            <span className='viewName'>{this.props.view.name}</span>
            </div>
        );
    }
});

module.exports = Sidebar;
