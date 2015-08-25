var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var Sidebar = require('../components/Sidebar.react');
var MainView = require('../components/MainView.react');
var SingleItemView = require('../components/SingleItemView.react');
var ModalView = require('../components/ModalView.react');
var TicketStore = require('../stores/TicketStore');
var UserStore = require('../stores/UserStore');
var ViewsByRole = require('../constants/ViewConstants').ViewsByRole;
var RebaseActions = require('../actions/RebaseActions');

var RebaseApp = React.createClass({

    changeView: function(view) {
        this.setState({
            currentView: view,
            modalIsOpen: false,
        });
        TicketStore.select(null);
    },

    _onChange: function() {
        this.setState({ loggedIn: UserStore.getState().loggedIn });
    },
    componentDidMount: function() {
        TicketStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        TicketStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onChange);
    },

    getInitialState: function() {
        var currentRole = this.props.user.roles[0];
        var currentView = ViewsByRole[currentRole.type][0];
        return {
            currentRole: currentRole,
            currentView: currentView,
            modalIsOpen: false,
            currentTicket: null,
            currentAuction: null,
            loggedIn: UserStore.getState().loggedIn,
        }
    },
    changeRole: function(newRole) {
        this.setState({
            currentRole: newRole,
            modalIsOpen: false,
            currentView: ViewsByRole[newRole.type][0],
        });
        TicketStore.select(null);
    },
    openModal: function() {
        this.setState({ modalIsOpen: true });
    },
    closeModal: function() {
        this.setState({ modalIsOpen: false });
    },
    render: function() {
        var props = {
            user: this.props.user,
            currentView: this.state.currentView,
            currentRole: this.state.currentRole,
            changeView: this.changeView,
            changeRole: this.changeRole,
            openModal: this.openModal,
            closeModal: this.closeModal,
            modalIsOpen: this.state.modalIsOpen,
        }
        if (!this.state.loggedIn) {
            return <LoginDialog />;
        }
        return (
            <div id='app'>
            <Sidebar {...props} />
            { this.state.modalIsOpen ? <ModalView currentRole={props.currentRole} closeModal={props.closeModal} /> : null }
            <MainView {...props} />
            </div>
        );
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
        RebaseActions.login(email, password);
    },
    attemptSignup: function() {
        alert('not implemented!');
        return;
        RebaseActions.login(this.state.email, this.state.password);
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
