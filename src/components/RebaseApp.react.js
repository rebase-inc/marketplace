var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var Sidebar = require('../components/Sidebar.react');
var ManagerView = require('../components/ManagerView.react');
var DeveloperView = require('../components/DeveloperView.react');
var SingleItemView = require('../components/SingleItemView.react');
var ModalView = require('../components/ModalView.react');
var TicketStore = require('../stores/TicketStore');
var AuctionStore = require('../stores/AuctionStore');
var ViewsByRole = require('../constants/ViewConstants').ViewsByRole;

function getState(user) {
    return {
        currentTicket: null,
    }
}

var RebaseApp = React.createClass({

    changeView: function(ind) {
        this.setState({
            currentView: ind ,
            currentTicket: null,
            currentAuction: null,
            modalIsOpen: false,
        });
    },

    _onChange: function() {
        this.setState({ });
    },
    componentDidMount: function() {
        TicketStore.addChangeListener(this._onChange);
        AuctionStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        TicketStore.removeChangeListener(this._onChange);
        AuctionStore.removeChangeListener(this._onChange);
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
        }
    },
    changeRole: function(newRole) {
        this.setState({
            currentRole: newRole,
            modalIsOpen: false,
            currentView: ViewsByRole[newRole.type][0],
        });
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
            modalIsOpen: this.state.modalIsOpen,
        }
        return (
            <div id='app'>
            <Sidebar {...props} />
            { this.state.modalIsOpen ? <ModalView closeModal={props.closeModal} /> : null }
            { this.state.currentRole.type == 'developer' ?
                <DeveloperView {...props} /> :
                <ManagerView {...props} />
            }
            </div>
        );
    },

});

module.exports = RebaseApp;
