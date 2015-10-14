// External
var React = require('react');
var _ = require('underscore');

// Components
var Icons = require('../components/Icons.react');

// Actions
var UserActions = require('../actions/UserActions');
var ManagerActions = require('../actions/ManagerActions');

//Stores
var ManagerStore = require('../stores/ManagerStore');
var ContractorStore = require('../stores/ContractorStore');

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
    getInitialState: function() {
        return {
            open: false,
            allManagers: ManagerStore.getState().allManagers,
            allContractors: ContractorStore.getState().allContractors,
        }
    },
    componentWillMount: function() {
        ManagerStore.addChangeListener(this._onManagerChange);
        ContractorStore.addChangeListener(this._onContractorChange);
    },
    componentWillUnmount: function() {
        ManagerStore.removeChangeListener(this._onManagerChange);
        ContractorStore.removeChangeListener(this._onContractorChange);
    },
    _onManagerChange: function() {
        this.setState(_.extend(this.state, ManagerStore.getState()));
    },
    _onContractorChange: function() {
        this.setState(_.extend(this.state, ContractorStore.getState()));
    },
    toggleDropdown: function() {
        this.setState(_.extend(this.state, { open: !this.state.open }));
    },
    roleName: function(role) {
        switch(role.type) {
            case 'manager': {
                if (role.hasOwnProperty('project')) {
                    return role.project.organization.name+'/'+role.project.name;
                } else {
                    return 'Manager View';
                }
            }; break;
            case 'contractor': return 'Contractor View';
            case 'owner': return 'Owner View';
        };
    },
    render: function() {
        return (
            <div id='roleSelector' className={this.state.open ? 'open' : ''} onClick={this.toggleDropdown}>
                <span> {this.roleName(this.props.currentRole)} </span>
            <Icons.Dropdown />
            { this.state.open ? <RoleSelectorDropdown {...this.props} roleName={this.roleName} allManagers={this.state.allManagers} allContractors={this.state.allContractors}/> : null }
            </div>
        );
    }
});

function makeRoleElement (role) {
    return (
        <li className={role == this.props.currentRole ? 'selected': ''} onClick={this.props.selectRole.bind(null, this.props.currentUser, role.id)} key={role.id}>
            { this.props.roleName(role) }
        </li>
    );
};

var RoleSelectorDropdown = React.createClass({
    propTypes: {
        allManagers: React.PropTypes.object.isRequired,
        allContractors: React.PropTypes.object.isRequired,
    },
    render: function() {
        var currentUserMgrRoles = Array.from(this.props.allManagers.values()).filter(mgr => mgr.user.id == this.props.currentUser.id);
        var currentUserContractorRoles = Array.from(this.props.allContractors.values()).filter(contractor=> contractor.user.id==this.props.currentUser.id);
        var managerRoleElements = currentUserMgrRoles.map(mgr => makeRoleElement.bind(this)(mgr));
        var contractorRoleElements = currentUserContractorRoles.map(contractor=> makeRoleElement.bind(this)(contractor));
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
