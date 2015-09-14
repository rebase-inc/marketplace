// External
var React = require('react');
var _ = require('underscore');

// Stores
var TicketStore = require('../stores/TicketStore');

// Actions
var TicketActions = require('../actions/TicketActions');

// Components
var SingleTicketView = require('../components/SingleTicketView.react');
var TicketList = require('../components/TicketList.react');
var SearchBar = require('../components/SearchBar.react');

var TicketView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return _.extend({ searchText: '' }, TicketStore.getState());
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
        console.log('finding talent with ticket id ', ticketID);
        if (!!ticketID) {  TicketActions.selectTicket(ticketID); }
        this.setState({ viewingTalent: true });
    },
    render: function() {
        var props = {
            loading: this.state.loading,
            currentUser: this.props.currentUser,
            currentRole: this.props.currentRole,
            searchText: this.state.searchText,
        }
        switch (!!this.state.currentTicket) {
            case true:
                props.unselectTicket = TicketActions.selectTicket.bind(null, null);
                props.currentTicket = this.state.currentTicket;
                props.findTalent = this.findTalent;
                props.viewingTalent = this.state.viewingTalent;
                return <SingleTicketView {...props} />;
                break;
            default:
                props.allTickets = this.state.allTickets;
                props.selectTicket = TicketActions.selectTicket;
                props.searchText = this.state.searchText;
                props.findTalent = this.findTalent;
                return (
                    <div className='ticketView'>
                        <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}/>
                        <TicketList {...props} />
                    </div>
                );
                break;
        }
    }
});


module.exports = TicketView;
