// External
var React = require('react');
var _ = require('underscore');

// Stores
var TicketStore = require('../stores/TicketStore');

// Actions
var TicketActions = require('../actions/TicketActions');

// Components
var TicketList = require('../components/TicketList.react');
var SearchBar = require('../components/SearchBar.react');
var TicketHeader = require('../components/TicketHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');

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
    render: function() {
        var props = {
            loading: this.state.loading,
            currentUser: this.props.currentUser,
            currentRole: this.props.currentRole,
        }
        switch (!!this.state.currentTicket) {
            case true:
                var buttons = <button onClick={this.toggleModal}>Find Talent</button>;
                var modal = null; //<BidModal {..._.extend({toggleModal: this.toggleModal}, {...this.props})} />
                return (
                    <div className='ticketView'>
                        { this.state.modalOpen ? modal : null }
                        <TicketHeader goBack={TicketActions.selectTicket.bind(null, null)} title={this.state.currentTicket.title}>
                            {buttons}
                        </TicketHeader>
                        <CommentList comments={this.state.currentTicket.comments}/>
                        <CommentBox ticket={this.state.currentTicket} user={this.props.currentUser} />
                    </div>
                );
                break;
            default:
                props.allTickets = this.state.allTickets;
                props.selectTicket = TicketActions.selectTicket;
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
