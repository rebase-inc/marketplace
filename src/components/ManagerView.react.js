var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var TicketStore = require('../stores/TicketStore');
var RebaseActions = require('../actions/RebaseActions');
var SingleItemView = require('../components/SingleItemView.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');

var ManagerView = React.createClass({
    getInitialState: function() {
        return _.extend({ filterText: '' }, TicketStore.getState());
    },
    getDataIfNeeded: function() {
        RebaseActions.getTicketData();
    },
    componentDidMount: function() {
        TicketStore.addChangeListener(this._onChange);
        this.getDataIfNeeded();
    },
    componentWillUnmount: function() {
        TicketStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(TicketStore.getState());
    },
    selectTicket: function(ticket) {
        TicketStore.select(ticket);
        this._onChange();
    },
    unselectTicket: function() {
        this.selectTicket(null);
    },
    // this is probably not how we should be handling the filterText
    handleUserInput: function(filterText) { this.setState({ filterText: filterText }); },
    render: function() {
        if (!!this.state.currentTicket) {
            var props = {
                backAction: this.unselectTicket,
                buttonAction: this.props.openModal,
                currentRole: this.props.currentRole,
                ticket: this.state.currentTicket,
                user: this.props.user,
            }
            return <SingleItemView {...props} />;
        } else {
            return (
                <div id='managerView' className='mainContent'>
                <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
                { this.state.loading ? <LoadingAnimation /> :
                    <NewTicketList
                    selectTicket={this.selectTicket}
                    tickets={this.state.allTickets.filter(ticket => ticket.type == this.props.currentView.type)}
                    filterText={this.state.filterText}/>
                }
                </div>
            );
        }
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

module.exports = ManagerView;
