var MainContent = React.createClass({
    render: function() {
        return (
            <div id='mainContent'>
            <SearchBar />
            <NewTicketList tickets={TICKETS}/>
            </div>);
    }
});

var NewTicket = React.createClass({
    render: function() {
        return (
            <tr className='newTicket'>
                <td className='findTalentPanel'>
                    <object data='img/lightning-bolt-icon-24px.svg' type='image/svg+xml'></object>
                    <p>Find Talent</p>
                </td>
                <td className='titlePanel'>{this.props.ticket.title}</td>
                <td className='skillsRequiredPanel'>{this.props.ticket.skillsRequired}</td>
                <td className='commentsPanel'>{this.props.ticket.comments.length} Comments</td>
            </tr>
        );
    }
});

var NewTicketList = React.createClass({
    render: function() {
        var all_tickets = [];
        this.props.tickets.forEach(function(ticket) {
            all_tickets.push(<NewTicket ticket={ticket} key={ticket.date} />);
        });
        return (
            <table id='newTicketList'>
            <tbody>{all_tickets}</tbody>
            </table>
        );
    }
});

var SearchBar = React.createClass({
    render: function() {
        return (
                <form id='newTicketSearchBar'>
                    <input type='text' placeholder='Search for tickets'/>
                </form>
               );
    }
});

var SidebarNav = React.createClass({
    render: function() {
        return (
            <div>
                <div>Some random view</div>
                <div>New/Waiting</div>
                <div>In Progress</div>
                <div>Completed</div>
            </div>
        );
    }
});

var SidebarProfile = React.createClass({
    render: function() {
        return ( <div>Andrew Millspaugh</div> );
    }
});


var Sidebar = React.createClass({
    render: function() {
        return ( 
                <div id='sidebar'>
                    <img className='logo' src='img/logo.png' alt='Alveare Logo'></img>
                    <SidebarNav/>
                    <SidebarProfile/>
                </div> 
               );
    }
});

var App = React.createClass({
    render: function() {
        return ( <div id='app'><Sidebar /><MainContent /></div> );
    }
});

var TICKETS = [
    {title: 'Fix this one thing', date: '1', skillsRequired: 'Python', comments: ['Foo','Bar']},
    {title: 'Fix this other thing', date: '2', skillsRequired: 'SQLAlchemy', comments: ['Foo','Bar', 'Baz']},
    {title: 'What the fuck you doin?', date: '3', skillsRequired: 'unittest', comments: ['Foo']},
    {title: 'Get rid of all this shit', date: '5', skillsRequired: 'State Machines', comments: ['Foo','Bar','Baz','Qux']},
    {title: 'Do my bidding', date: '4', skillsRequired: 'unittest', comments: ['Foo','Bar']},
    {title: 'Do my bidding', date: '6', skillsRequired: 'unittest', comments: ['Foo','Bar']},
    {title: 'Do my bidding', date: '7', skillsRequired: 'unittest', comments: ['Foo','Bar']},
    {title: 'Do my bidding', date: '8', skillsRequired: 'unittest', comments: ['Foo','Bar']},
    {title: 'Do my bidding', date: '9', skillsRequired: 'unittest', comments: ['Foo','Bar']},
    {title: 'Do my bidding', date: '10', skillsRequired: 'unittest', comments: ['Foo','Bar']},
];

React.render(<App />, document.body);
