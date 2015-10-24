// External
var React = require('react');
var _ = require('underscore');

// Constants
var ViewTypes = require('../constants/ViewConstants').ViewTypes;

// Stores
var TicketStore = require('../stores/TicketStore');

// Actions
var TicketActions = require('../actions/TicketActions');
let UserActions = require('../actions/UserActions');

// Components
var SingleTicketView = require('../components/SingleTicketView.react');
var NewTicketModal = require('../components/NewTicketModal.react');
var TicketList = require('../components/TicketList.react');
var SearchBar = require('../components/SearchBar.react');
var NothingHere = require('../components/NothingHere.react');
var Icons = require('../components/Icons.react');

var TicketView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return _.extend({ searchText: '', modalOpen: false }, TicketStore.getState());
    },
    _onChange: function() {
        this.setState(TicketStore.getState());
    },
    componentDidMount: function() {
        TicketStore.addChangeListener(this._onChange);
        setTimeout(TicketActions.getTicketData, 0);
    },
    componentWillUnmount: function() {
        TicketStore.removeChangeListener(this._onChange);
    },
    handleUserInput: function(searchText) {
        this.setState({ searchText: searchText });
    },
    findTalent: function(ticketID) {
        if (!!ticketID) {  TicketActions.selectTicket(ticketID); }
        this.setState({ modalOpen: true });
    },
    toggleModal: function() {
        this.setState({ modalOpen: !this.state.modalOpen });
    },
    render: function() {
        var props = {
            loading: this.state.loading,
            currentUser: this.props.currentUser,
            currentRole: this.props.currentRole,
            searchText: this.state.searchText,
        }
        // If there aren't any tickets to display and we're not in the process of finding any,
        // display the nothing here screen, with some actions to help the user get out of this state.
        if (!this.state.allTickets.length && !this.state.loading) {
            return (
                <NothingHere>
                    <h3>In order to get some work done, you first need some tasks</h3>
                    <button>Import Another Project</button>
                    <span>OR</span>
                    <button className='notification'>Add a Task</button>
                </NothingHere>
            );
        }
        switch (!!this.state.currentTicket) {
            case true:
                props.unselectTicket = TicketActions.selectTicket.bind(null, null);
                props.currentTicket = this.state.currentTicket;
                props.findTalent = this.findTalent;
                props.viewingTalent = this.state.viewingTalent;
                props.modalOpen = this.state.modalOpen;
                props.toggleModal = this.toggleModal;
                return <SingleTicketView {...props} />;
                break;
            case false:
                props.allTickets = this.state.allTickets;
                props.selectTicket = TicketActions.selectTicket;
                props.searchText = this.state.searchText;
                props.findTalent = this.findTalent;
                props.changeSearchText = this.handleUserInput;
                props.modalOpen = this.state.modalOpen;
                props.toggleModal = this.toggleModal;
                return (
                    <div className='ticketView'>
                        <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}><Icons.AddTicket onClick={this.toggleModal}/></SearchBar>
                        <TicketList {...props} />
                        { !!this.state.modalOpen ? <NewTicketModal project={this.props.currentRole.project} toggleModal={this.toggleModal} /> : null }
                    </div>
                );
                break;
        }
    }
});


module.exports = TicketView;
