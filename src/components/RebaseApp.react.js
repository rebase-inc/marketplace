var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var Sidebar = require('../components/Sidebar.react');
var MainView = require('../components/MainView.react');
var ModalView = require('../components/ModalView.react');
var TicketStore = require('../stores/TicketStore');
var UserStore = require('../stores/UserStore');
var viewConstants = require('../constants/viewConstants');
var UserActions = require('../actions/UserActions');

var RebaseApp = React.createClass({
    selectRole: function(roleID) {
        UserActions.selectRole(roleID);
    },
    getInitialState: function() {
        return _.extend({ modalIsOpen: false }, UserStore.getState());
    },
    openModal: function() {
        this.setState({ modalIsOpen: true });
    },
    closeModal: function() {
        this.setState({ modalIsOpen: false });
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
            closeModal: this.closeModal,
        }
        var mainProps = {
            currentUser: this.state.currentUser,
            currentView: this.state.currentView,
            currentRole: this.state.currentRole,
        };
        var App = (
            <div id='app'>
                <Sidebar {...sidebarProps} />
                { this.state.modalIsOpen ? <ModalView {...modalProps} /> : null }
                <MainView {...mainProps} />
            </div>
        );
        return this.state.loggedIn ? App : <LoginDialog />;
    },

});

var LoginDialog = React.createClass({
    handleKeyPress: function(event) {
        if (event.charCode == 13) { this.attemptLogin(); }
        else { this.handleInput(); }
    },
    attemptLogin: function() {
        var email = this.refs.email.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;
        UserActions.login(email, password);
    },
    attemptSignup: function() {
        alert('not implemented!');
        return;
        UserActions.login(this.state.email, this.state.password);
    },
    handleInput: function() {
        this.setState({
            email: this.refs.email.getDOMNode().value,
            password: this.refs.password.getDOMNode().value,
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
