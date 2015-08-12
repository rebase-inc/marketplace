var React = require('react');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');

var TicketStore = require('../stores/TicketStore');


var RebaseApp = React.createClass({
    // Method to setState based upon Store changes
    _onChange: function() { this.setState(getAppState()); },

    componentDidMount: function() { TicketStore.addChangeListener(this._onChange); },
    componentWillUnmount: function() { TicketStore.removeChangeListener(this._onChange); },

    changeView: function(viewName) {
        this.setState({
            currentViewName: viewName ,
            currentTicket: {}
        });
    },
    changeProject: function(organization, project) {
        this.setState({
            organization: organization,
            project: project
        });
    },
    selectTicket: function(ticket) {
        this.setState({ currentTicket: ticket });
    },
    render: function() {
        var role = this.props.appState.user.roles[this.props.appState.viewState.currentView].type; //facepalm
        var currentView = this.props.views[role][this.props.appState.viewState.currentView].name; //facepalm again
        console.log('ticket store');
        console.log(TicketStore.getTickets());
        return (
            <div id='app'>
            <Sidebar user={this.props.appState.user} viewState={this.props.appState.viewState} views={this.props.views}/>
            {currentView === 'Offered' ?     <NewTicketView tickets={TicketStore.getTickets()} /> : null}
            {currentView === 'In Progress' ? <div>IN PROGRESS</div> : null}
            {currentView === 'Completed' ?   <div>COMPLETED</div> : null}
            </div>
        );
    }
});

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

var TicketHeader = React.createClass({
    render: function() {
        return (
            <div id='ticketHeader'>
                <DropbackIcon />
                <span>{this.props.title}</span>
                <button>Find Talent</button>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var all_comments = [];
        this.props.comments.forEach(function(comment) {
            all_comments.push(
                <div className='comment'>
                    <div className='photo'>
                        <img src='img/andrew.png'/>
                    </div>
                    <div className='content'>
                        <div className='name'>{comment.name}</div>
                        <div className='date'>{comment.date}</div>
                        <div className='text'>{comment.text}</div>
                    </div>
                </div>
            );
        });
        return ( <div id='commentList'> {all_comments} </div>);
    }
});

var TicketInfo = React.createClass({
    render: function() {
        return (
            <div>
            <CommentList comments={this.props.comments} />
            </div>
        );
    }
});

var SingleTicket = React.createClass({
    getInitialState: function() {
        return { view: 'viewingComments' }
    },
    render: function() {
        return (
            <div id='singleTicketView' className='mainContent'>
                <div id='singleTicket'>
                    <TicketHeader title={this.props.ticket.title} view={this.state.view}/>
                    <CommentList comments={this.props.ticket.comments}/>
                    <div id='newCommentBox'><textarea type='text' placeholder='Leave a comment'/></div>
                </div>
            </div>
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




var Sidebar = React.createClass({
    render: function() {
        return (
            <div id='sidebar'>
            <img className='logo' src='img/logo.svg' alt='Rebase Logo'/>
            <SidebarNav user={this.props.user} viewState={this.props.viewState} views={this.props.views}/>
            <SidebarProfile user={this.props.user} />
            </div>
        );
    }
});

var SidebarNav = React.createClass({

    render: function() {
        var roleDisplay, views;
        var selectedRole = this.props.user.roles[_selectedRoleIndex];
        if (selectedRole.type == 'developer') {
            roleDisplay = 'Developer Role';
            views = this.props.views.developer;
        }
        else if (selectedRole.type == 'manager') {
            roleDisplay = selectedRole.organization + '/' + selectedRole.project;
            views = this.props.views.manager;
        }
        else {
            roleDisplay = 'Unknown Role';
        }
        return (
            <div id='sidebarNav'>
            <RoleSelector user={this.props.user} role={roleDisplay} />
            <div id='viewList'>
            {views.map(
                function(data, i) { return (<ViewSelection view={data}/>); }
            )}
            </div>
            </div>
        );
    }
});

var SidebarProfile = React.createClass({
    render: function() {
        return (
                <div id='sidebarProfile'>
                <img src={this.props.user.photo}/>
                <span>{this.props.user.name}</span>
                <Icons.Dropdown/>
                </div>
               );
    }
});


var _selectedRoleIndex = 0;

var RoleSelector = React.createClass({
    render: function() {
        return (
            <div id='roleSelector'>
            <span> {this.props.role} </span>
            <Icons.Dropdown />
            </div>
        );
    }
});

var ViewSelection = React.createClass({
    selectView: function() {
        this.props.changeView( this.props.view.name );
    },
    render: function() {
        var className = 'viewSelection';
        if (this.props.view.name == this.props.currentViewName) { className = className + ' selected'; }
        return (
            <div className={className} onClick={this.selectView}>
            <span className='viewIcon'>
            <img src={this.props.view.icon}/>
            </span>
            <span className='viewName'>{this.props.view.name}</span>
            </div>
        );
    }
});

module.exports = RebaseApp;
