var React = require('react');
var Icons = require('../components/RebaseIcons.react');

var ViewTypes = require('../constants/viewconstants').ViewTypes;
var ContractorViews = require('../constants/viewconstants').ContractorViews;
var ManagerViews = require('../constants/viewconstants').ManagerViews;

var Sidebar = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        currentView: React.PropTypes.object.isRequired,
        selectRole: React.PropTypes.func.isRequired,
        selectView: React.PropTypes.func.isRequired,
    },
    render: function() {
        return (
            <div id='sidebar' className='noselect'>
                <img className='logo' src='img/logo.svg' alt='Rebase Logo'/>
                <SidebarNav {...this.props} />
                <SidebarProfile user={this.props.currentUser} />
            </div>
        );
    }
});

var SidebarNav = React.createClass({
    render: function() {
        var viewProps = {
            selectView: this.props.selectView,
            currentView: this.props.currentView,
        }
        var roleProps = {
            currentUser: this.props.currentUser,
            currentRole: this.props.currentRole,
            changeRole: this.props.changeRole,
        }
        var allViews = [];
        // the views are pushed explicitly, because javascript implementations don't guarantee object key order
        // so a map or similar operation cannot be used. Probably should switch to storing the data in array, then.
        switch (this.props.currentRole.type) {
            case 'contractor':
                allViews.push(<ViewSelection view={ContractorViews[ViewTypes.OFFERED]} {...viewProps} />);
                allViews.push(<ViewSelection view={ContractorViews[ViewTypes.IN_PROGRESS]} {...viewProps} />);
                allViews.push(<ViewSelection view={ContractorViews[ViewTypes.COMPLETED]} {...viewProps} />);
            break;
            case 'manager':
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.NEW]} {...viewProps} />);
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.OFFERED]} {...viewProps} />);
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.IN_PROGRESS]} {...viewProps} />);
                allViews.push(<ViewSelection view={ManagerViews[ViewTypes.COMPLETED]} {...viewProps} />);
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
    render: function() {
        return (
                <div id='sidebarProfile'>
                <img src={this.props.user.photo}/>
                <span>{this.props.user.name}</span>
                <Icons.Dropdown/>
                </div>
               );
    }
});

var RoleSelector = React.createClass({
    getInitialState: function() {
        return { open: false }
    },
    toggleDropdown: function() {
        this.setState({ open: !this.state.open });
    },
    render: function() {
        return (
            <div id='roleSelector' className={this.state.open ? 'open' : ''} onClick={this.toggleDropdown}>
            <span> { this.props.currentRole.type == 'contractor' ? 'Contractor View' : this.props.currentRole.organization } </span>
            <Icons.Dropdown />
            { this.state.open ? <RoleSelectorDropdown {...this.props} /> : null }
            </div>
        );
    }
});

var RoleSelectorDropdown = React.createClass({
    selectRole: function() {
       this.props.changeRole(2);
    },
    render: function() {
        var managerRoles = this.props.currentUser.roles.filter(function(el) { return el.type == 'manager'; });
        var contractorRoles = this.props.currentUser.roles.filter(function(el) { return el.type == 'contractor'; });
        var managerRoleElements = managerRoles.map(function(role) {
            return (
                <li className={role == this.props.currentRole ? 'selected': ''}
                onClick={function() { this.props.changeRole(role) }.bind(this)}>
                {role.organization + '/' + role.project}
                </li>
            );
        }.bind(this));
        var contractorRoleElements = contractorRoles.map(function(role) {
            return (
                <li className={role == this.props.currentRole ? 'selected': ''}
                onClick={function() { this.props.changeRole(role) }.bind(this)}>
                {'Contractor View'}
                </li>
            );
        }.bind(this));
        !!managerRoleElements.length ? managerRoleElements.unshift(<li className='header'>Manager</li>) : null;
        !!contractorRoleElements.length ? contractorRoleElements.unshift(<li className='header'>Contractor</li>) : null;
        return (
            <div id='roleSelectorDropdown'>
                <ul> { managerRoleElements } { contractorRoleElements } </ul>
            </div>
        );
    }
});

var ViewSelection = React.createClass({
    selectView: function() {
        this.props.changeView( this.props.view );
    },
    render: function() {
        var className = 'viewSelection';
        if (this.props.view == this.props.currentView) { className = className + ' selected'; }
        return (
            <div className={className} onClick={this.selectView}>
            <span className='viewIcon'>
            <img src={this.props.view.icon}/>
            </span>
            <span className='viewName'>{this.props.view.name}</span>
            </div>
        );
    }
});

module.exports = Sidebar;
