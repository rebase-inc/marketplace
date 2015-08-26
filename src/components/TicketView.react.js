// External
var React = require('react');
var _ = require('underscore');

// Stores
var TicketStore = require('../stores/TicketStore');

// Actions
var TicketActions = require('../actions/TicketActions');

// Components
var SearchBar = require('../components/SearchBar.react');

// Constants
var viewConstants = require('../constants/viewConstants');

var TicketView = React.createClass({
    //getInitialState: function() {
        //var baseState = { searchText: '' };
        //return _.extend(baseState, TicketStore.getState());
    //},
    //componentDidMount: function() {
        //TicketStore.addChangeListener(this._onChange);
        //setTimeout(TicketActions.getTicketData, 0);
    //},
    //componentWillUnmount: function() {
        //TicketStore.removeChangeListener(this._onChange);
    //},
    //_onChange: function() {
        //this.setState(TicketStore.getState());
    //},
    //selectTicket: function(ticket) {
        //TicketStore.select(ticket);
        //this._onChange();
    //},
    //unselectTicket: function() {
        //this.selectTicket(null);
    //},
    // this is probably not how we should be handling the filterText
    //handlejUserInput: function(filterText) { this.setState({ filterText: filterText }); },
    render: function() {
        return <div>fuck my life again</div>;
        //if (!!this.state.currentTicket) {
            //var props = {
                //backAction: this.unselectTicket,
                //buttonAction: this.props.openModal,
                //currentRole: this.props.currentRole,
                //ticket: this.state.currentTicket,
                //user: this.props.user,
            //}
            //return <SingleItemView {...props} />;
        //} else {
            //// make sure we only display new tickets - this is really only important if the user is logged in as admin
            //var props = {
                //searchText: this.state.searchText,
                //selectTicket: this.selectTicket,
                //currentRole: this.props.currentRole,
                //tickets: this.state.allTickets.filter(ticket => ticket.type == viewConstants.ViewTypes.NEW),
            //}
            //return (
                //<div className='mainContent'>
                //<SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
                //{ this.state.loading ? <LoadingAnimation /> : <TicketList {...props} /> }
                //</div>
            //);
        //}
    }
});

var TicketList = React.createClass({
    render: function() {
        var props = {
            selectTicket: this.props.selectTicket,
            currentRole: this.props.currentRole,
        }
        var ticketMatchesText = function(ticket) {
            return ticket.title.indexOf(this.props.searchText) != -1;
        }.bind(this);
        var makeTicketElement = function(ticket) {
            return <Ticket ticket={ticket} key={ticket.id} {...props} />;
        }.bind(props);
        return (
            <table id='ticketList'>
                <tbody>
                    { this.props.tickets.filter(ticketMatchesText).map(makeTicketElement) }
                </tbody>
            </table>
        );
    }
});

var Ticket = React.createClass({
    selectTicket: function() { this.props.selectTicket(this.props.ticket); },
    render: function() {
        var role = this.props.currentRole;
        return (
            <tr className='ticket'>
                { role.type == 'manager' ?
                    <FindTalentPanel ticket={this.props.ticket} /> :
                    <ProjectInfoPanel ticket={this.props.ticket} /> }
                <td className='titlePanel'>{this.props.ticket.title}</td>
                <td className='skillsRequiredPanel'>{this.props.ticket.skillsRequired}</td>
                <td className='commentsPanel' onClick={this.selectTicket}>
                    <Icons.Comment/>
                    <span>{this.props.ticket.comments.length} Comments</span>
                </td>
            </tr>
        );
    }
});

var FindTalentPanel = React.createClass({
    handleClick: function() { alert('Finding talent, motherfucker.'); },
    render: function() {
        return (
            <td onClick={this.handleClick} className='findTalentPanel'>
            <Icons.FindTalent/>
            <span>Find Talent</span>
            </td>
        );
    }
});


module.exports = TicketView;
