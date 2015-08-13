var React = require('react');
var Icons = require('../components/RebaseIcons.react');

var Sidebar = React.createClass({
    render: function() {
        return (
            <div id='sidebar' className='noselect'>
            <img className='logo' src='img/logo.svg' alt='Rebase Logo'/>
            <SidebarNav changeRole={this.props.changeRole} currentView={this.props.currentView} user={this.props.user} viewState={this.props.viewState} views={this.props.views} changeView={this.props.changeView}/>
            <SidebarProfile user={this.props.user} />
            </div>
        );
    }
});

var SidebarNav = React.createClass({

    render: function() {
        var roleDisplay, views;
        var selectedRole = this.props.user.roles[this.props.viewState.currentRole];
        if (selectedRole.type == 'developer') {
            roleDisplay = 'Developer View';
            views = this.props.views.developer;
        }
        else if (selectedRole.type == 'manager') {
            roleDisplay = selectedRole.organization + '/' + selectedRole.project;
            views = this.props.views.manager;
        }
        else {
            roleDisplay = 'Unknown Role';
        }
        return (
            <div id='sidebarNav'>
            <RoleSelector viewState={this.props.viewState} changeRole={this.props.changeRole} user={this.props.user} role={roleDisplay} />
            <div id='viewList'>
            {views.map( function(data, i) { return (<ViewSelection currentView={this.props.currentView} changeView={this.props.changeView} view={data}/>); }.bind(this))}
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
        if (this.state.dropdownOpen) {
            dropdown = <RoleSelectorDropdown user={this.props.user} changeRole={this.props.changeRole} viewState={this.props.viewState} />;
            className = 'open';
        }
        return (
            <div id='roleSelector' className={className} onClick={this.toggleDropdown}>
            <span> {this.props.role} </span>
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
        var developerRoles = this.props.user.roles.filter(function(el) { return el.type == 'developer'; });
        var managerRoles = this.props.user.roles.filter(function(el) { return el.type == 'manager'; });
        var selectedRole = this.props.user.roles[this.props.viewState.currentRole];
        return (
            <div id='roleSelectorDropdown'>
            <ul>
            <li className='header'>Manager</li>
            { managerRoles.map(function(data, i) { return (<li onClick={this.selectRole} className={data == selectedRole ? 'selected': ''}>{data.organization + '/' + data.project}</li>) }.bind(this)) }
            <li className='header'>Developer</li>
            { developerRoles.map(function(data, i) { return (<li onClick={this.selectRole} className={data == selectedRole ? 'selected': ''}>Developer View</li>) }.bind(this)) }
            </ul>
            </div>
        );
    }
});

var ViewSelection = React.createClass({
    selectView: function() {
        this.props.changeView( this.props.view.name );
    },
    render: function() {
        var className = 'viewSelection';
        if (this.props.view.name == this.props.currentView) { className = className + ' selected'; }
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
