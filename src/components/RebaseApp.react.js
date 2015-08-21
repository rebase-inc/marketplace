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
            modalOpen: false,
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
            modalOpen: false,
            currentTicket: null,
            currentAuction: null,
        }
    },
    selectTicket: function(ticket) {
        this.setState({
            currentAuction: null,
            currentTicket: ticket,
            modalOpen: false,
        });
    },
    unselectItem: function() {
        this.setState({
            currentAuction: null,
            currentTicket: null,
            modalOpen: false,
        });
    },
    changeRole: function(newRole) {
        this.setState({
            currentRole: newRole,
            currentTicket: null,
            currentAuction: null,
            modalOpen: false,
        });
    },
    openModal: function() {
        this.setState({ modalOpen: true });
    },
    closeModal: function() {
        this.setState({ modalOpen: false });
    },
    render: function() {
        var currentViewElement;
        var props = {
            currentRole: this.state.currentRole,
            user: this.props.user,
            openModal: this.openModal,
        }
        var viewElements = {
            developer: <DeveloperView {...props} />,
            manager: <ManagerView selectTicket={this.selectTicket}/>,
        }
        if (!!this.state.currentTicket || !!this.state.currentAuction) {
        }
        else {
            currentViewElement = viewElements[this.state.currentRole.type];
        }
        return (
            <div id='app'>
            <Sidebar user={this.props.user}
            currentRole={this.state.currentRole} changeRole={this.changeRole}
            currentView={this.state.currentView} changeView={this.changeView}/>
            { (this.state.modalOpen) ? <ModalView closeModal={this.closeModal} /> : null }
            { currentViewElement }
            </div>
        );
    },

});

module.exports = RebaseApp;
