var React = require('react');
var Icons = require('../components/RebaseIcons.react');

var NewTicketView = React.createClass({
    getInitialState: function() {
        return { filterText: '' };
    },
    // this is probably not how we should be handling the filterText
    handleUserInput: function(filterText) { this.setState({ filterText: filterText }); },
    render: function() {
        return (
            <div id='newTicketView' className='mainContent'>
            <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
            <NewTicketList selectTicket={this.props.selectTicket} tickets={this.props.tickets} filterText={this.state.filterText}/>
            </div>
        );
    }
});

var NewTicketList = React.createClass({
    render: function() {
        var all_tickets = [];
        this.props.tickets.forEach(function(ticket) {
            if ( ticket.title.indexOf(this.props.filterText) == -1 ) {
                return;
            }
            all_tickets.push(<NewTicket ticket={ticket} key={ticket.date} selectTicket={this.props.selectTicket}/>);
        }.bind(this));
        return (
            <table id='newTicketList'>
            <tbody>{all_tickets}</tbody>
            </table>
        );
    }
});

var NewTicket = React.createClass({
    selectTicket: function() { this.props.selectTicket(this.props.ticket); },
    render: function() {
        return (
            <tr className='newTicket'>
                <FindTalentPanel />
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

var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onUserInput( this.refs.filterTextInput.getDOMNode().value );
    },
    render: function() {
        return (
                <form id='newTicketSearchBar'>
                    <input type='text' placeholder='Search for tickets' value={this.props.filterText} onChange={this.handleChange} ref='filterTextInput'/>
                </form>
               );
    }
});

module.exports = NewTicketView;
