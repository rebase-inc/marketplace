var React = require('react');
var Icons = require('../components/RebaseIcons.react');
var ViewsByRole = require('../constants/ViewConstants').ViewsByRole;

var Sidebar = React.createClass({
    render: function() {
        return (
            <div id='sidebar' className='noselect'>
            <img className='logo' src='img/logo.svg' alt='Rebase Logo'/>
            <SidebarNav user={this.props.user}
            currentRole={this.props.currentRole} changeRole={this.props.changeRole}
            currentView={this.props.currentView} changeView={this.props.changeView} />
            <SidebarProfile user={this.props.user} />
            </div>
        );
    }
});

var SidebarNav = React.createClass({

    render: function() {
        var allViews = ViewsByRole[this.props.currentRole.type].map( function(view) {
            return (
                <ViewSelection view={view}
                currentView={this.props.currentView} changeView={this.props.changeView} />
            );
        }.bind(this));
        return (
            <div id='sidebarNav'>
            <RoleSelector user={this.props.user}
            changeRole={this.props.changeRole} currentRole={this.props.currentRole} />
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
        return { dropdownOpen: false }
    },
    toggleDropdown: function() {
        //this.props.changeRole();
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    },
    render: function() {
        var dropdown;
        var className;
        var roleDisplayName;
        switch (this.props.currentRole.type) {
            case 'developer': roleDisplayName = 'Developer View'; break;
            case 'manager': roleDisplayName = this.props.currentRole.organization + '/' + this.props.currentRole.project; break;
            default: roleDisplayName = 'Unknown Role'; break;
        }
        if (this.state.dropdownOpen) {
            dropdown = <RoleSelectorDropdown user={this.props.user}
            changeRole={this.props.changeRole} currentRole={this.props.currentRole} />;
            className = 'open';
        }
        return (
            <div id='roleSelector' className={className} onClick={this.toggleDropdown}>
            <span> { roleDisplayName } </span>
            <Icons.Dropdown />
            { dropdown }
            </div>
        );
    }
});

var RoleSelectorDropdown = React.createClass({
    selectRole: function() {
       this.props.changeRole(2);
    },
    render: function() {
        var managerRoles = this.props.user.roles.filter(function(el) { return el.type == 'manager'; });
        var developerRoles = this.props.user.roles.filter(function(el) { return el.type == 'developer'; });
        var managerRoleElements = managerRoles.map(function(role) {
            return (
                <li className={role == this.props.currentRole ? 'selected': ''}
                onClick={function() { this.props.changeRole(role) }.bind(this)}>
                {role.organization + '/' + role.project}
                </li>
            );
        }.bind(this));
        var developerRoleElements = developerRoles.map(function(role) {
            return (
                <li className={role == this.props.currentRole ? 'selected': ''}
                onClick={function() { this.props.changeRole(role) }.bind(this)}>
                {'Developer View'}
                </li>
            );
        }.bind(this));
        return (
            <div id='roleSelectorDropdown'>
            <ul>
            <li className='header'>Manager</li>
            { managerRoleElements }
            <li className='header'>Developer</li>
            { developerRoleElements }
            </ul>
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
