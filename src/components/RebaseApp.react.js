var React = require('react');
var _ = require('underscore');

var Icons = require('../components/Icons.react');
var Sidebar = require('../components/Sidebar.react');
var TicketStore = require('../stores/TicketStore');
var UserStore = require('../stores/UserStore');
var viewConstants = require('../constants/viewConstants');
var UserActions = require('../actions/UserActions');

var TicketView = require('../components/TicketView.react');
var AuctionView = require('../components/AuctionView.react');
var ContractView = require('../components/ContractView.react');
var ReviewView = require('../components/ReviewView.react');
var ProfileView = require('../components/ProfileView.react');

var RebaseApp = React.createClass({
    selectRole: function(roleID) {
        UserActions.selectRole(roleID);
    },
    getInitialState: function() {
        return _.extend({ modalIsOpen: false }, UserStore.getState());
    },
    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(UserStore.getState());
    },
    render: function() {
        var sidebarProps = {
            currentUser: this.state.currentUser,
            currentView: this.state.currentView,
            currentRole: this.state.currentRole,
            selectRole: this.selectRole,
        };
        var modalProps = {
            currentUser: this.state.currentUser,
            currentView: this.state.currentView,
            currentRole: this.state.currentRole,
        }
        var mainProps = {
            currentUser: this.state.currentUser,
            currentView: this.state.currentView,
            currentRole: this.state.currentRole,
        };
        var View;
        if (!this.state.loggedIn) {
            return <LoginDialog />
        } else {
            return (
                <div id='app'>
                    <Sidebar {...sidebarProps} />
                    {
                        (function(currentView) {
                            console.log(currentView);
                            switch (currentView) {
                                case viewConstants.ViewTypes.NEW: return <TicketView {...mainProps} />; break;
                                case viewConstants.ViewTypes.OFFERED: return <AuctionView {...mainProps} />; break;
                                case viewConstants.ViewTypes.IN_PROGRESS: return <ContractView {...mainProps} />; break;
                                case viewConstants.ViewTypes.COMPLETED: return <ReviewView {...mainProps} />; break;
                                case viewConstants.ViewTypes.PROFILE: return <ProfileView {...mainProps} />; break;
                                default: return <div>ERROR</div>; break;
                            }
                        })(this.state.currentView.type)
                    }
                </div>
            );
        }
    },

});

var LoginDialog = React.createClass({
    handleKeyPress: function(event) {
        if (event.charCode == 13) { this.attemptLogin(); }
        else { this.handleInput(); }
    },
    attemptLogin: function() {
        var email = this.refs.email.value;
        var password = this.refs.password.value;
        UserActions.login(email, password);
    },
    attemptSignup: function() {
        alert('not implemented!');
        return;
        UserActions.login(this.state.email, this.state.password);
    },
    handleInput: function() {
        this.setState({
            email: this.refs.email.value,
            password: this.refs.password.value,
        });
    },
    render: function() {
        return (
            <div id='login-background'>
                <div id='login-box' onKeyPress={this.handleKeyPress}>
                    <img src='img/logo.svg' alt='Rebase Logo' />
                    <input id='email' type='email' ref='email' className='required email' placeholder='Email' />
                    <input id='password' type='password' ref='password' placeholder='Password' />
                    <button id='log-in' onClick={this.attemptLogin}>Log in</button>
                    <div id='error-message'></div>
                </div>
            </div>
        );
    }
});

module.exports = RebaseApp;
