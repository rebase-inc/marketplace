// External
var React = require('react');

// Components
var Icons = require('../components/Icons.react');

// Actions
var UserActions = require('../actions/UserActions');

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
                    {
                        !!this.props.currentUser.photo ?
                        <img src={this.props.currentUser.photo}/> :
                        <Icons.ProfilePicture user={this.props.currentUser} />
                    }
                    <span>{this.props.currentUser.first_name + ' ' + this.props.currentUser.last_name}</span>
                    <Icons.Dropdown />
                </div>
                <ProfileOptions isOpen={this.state.optionsOpen} {...this.props} />
            </div>
       );
    }
});

var ProfileOptions = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        isOpen: React.PropTypes.bool.isRequired,
    },
    render: function() {
        return (
            <div id='profileOptions' className={this.props.isOpen ? 'open' : null}>
                <ul>
                    <li onClick={UserActions.selectView.bind(null, ViewTypes.PROFILE)}>Profile</li>
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
    getInitialState: function() {
        return { open: false }
    },
    toggleDropdown: function() {
        this.setState({ open: !this.state.open });
    },
    render: function() {
        return (
            <div id='roleSelector' className={this.state.open ? 'open' : ''} onClick={this.toggleDropdown}>
            <span> { this.props.currentRole.type == 'contractor' ? 'Contractor View' : this.props.currentRole.organization.projects[0].name } </span>
            <Icons.Dropdown />
            { this.state.open ? <RoleSelectorDropdown {...this.props} /> : null }
            </div>
        );
    }
});

var RoleSelectorDropdown = React.createClass({
    render: function() {
        var managerRoles = this.props.currentUser.roles.filter(function(el) { return el.type == 'manager'; });
        var contractorRoles = this.props.currentUser.roles.filter(function(el) { return el.type == 'contractor'; });
        var managerRoleElements = managerRoles.map(function(role) {
            return (
                <li className={role == this.props.currentRole ? 'selected': ''} onClick={this.props.selectRole.bind(null, role.id)} key={role.id}>
                    {role.organization.projects[0].name}
                </li>
            );
        }.bind(this));
        var contractorRoleElements = contractorRoles.map(function(role) {
            return (
                <li className={role == this.props.currentRole ? 'selected': ''} onClick={this.props.selectRole.bind(null, role.id)} key={role.id}>
                    {'Contractor View'}
                </li>
            );
        }.bind(this));
        !!managerRoleElements.length ? managerRoleElements.unshift(<li className='header' key='manager-header'>Manager</li>) : null;
        !!contractorRoleElements.length ? contractorRoleElements.unshift(<li className='header' key='contractor-header'>Contractor</li>) : null;
        return (
            <div id='roleSelectorDropdown'>
                <ul> { managerRoleElements } { contractorRoleElements } </ul>
            </div>
        );
    }
});

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
