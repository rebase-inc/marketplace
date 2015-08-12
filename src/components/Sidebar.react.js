var React = require('react');
var Icons = require('../components/RebaseIcons.react');

var Sidebar = React.createClass({
    render: function() {
        return (
            <div id='sidebar'>
            <img className='logo' src='img/logo.svg' alt='Rebase Logo'/>
            <SidebarNav user={this.props.user} viewState={this.props.viewState} views={this.props.views}/>
            <SidebarProfile user={this.props.user} />
            </div>
        );
    }
});

var SidebarNav = React.createClass({

    render: function() {
        var roleDisplay, views;
        var selectedRole = this.props.user.roles[_selectedRoleIndex];
        if (selectedRole.type == 'developer') {
            roleDisplay = 'Developer Role';
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
            <RoleSelector user={this.props.user} role={roleDisplay} />
            <div id='viewList'>
            {views.map(
                function(data, i) { return (<ViewSelection view={data}/>); }
            )}
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

var _selectedRoleIndex = 0;

var RoleSelector = React.createClass({
    render: function() {
        return (
            <div id='roleSelector'>
            <span> {this.props.role} </span>
            <Icons.Dropdown />
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
        if (this.props.view.name == this.props.currentViewName) { className = className + ' selected'; }
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
