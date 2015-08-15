var React = require('react/addons');
var Icons = require('../components/RebaseIcons.react');

var AvailableAuctionsView = React.createClass({
    getInitialState: function() {
        return { filterText: '' };
    },
    handleUserInput: function(filterText) { this.setState({ filterText: filterText }); },
    render: function() {
        return (
            <div id='availableAuctionsView' className='mainContent'>
            <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
            <AvailableAuctionsList selectTicket={this.props.selectTicket} availableAuctions={this.props.availableAuctions} filterText={this.state.filterText}/>
            </div>
        );
    }
});

var LoadingAnimation = React.createClass({
    render: function() {
        return (
            <div className="spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
            </div>
        );
    }
});

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var AvailableAuctionsList = React.createClass({
    render: function() {
        var availableAuctionElements = [];
        if (!this.props.availableAuctions.length) {
            return <LoadingAnimation />
        }
        this.props.availableAuctions.forEach(function(auction, ind) {
            var _ticket = auction.ticket_set.bid_limits[0].ticket_snapshot.ticket;
            if ( _ticket.title.indexOf(this.props.filterText) == -1 ) { return; }
            availableAuctionElements.push(<AvailableAuction key={ind} ticket={_ticket} key={_ticket.id} selectTicket={this.props.selectTicket}/>);
        }.bind(this));
        return (
            <table id='availableAuctionList'>
            <ReactCSSTransitionGroup component='tbody' transitionName='example'>
            {availableAuctionElements}
            </ReactCSSTransitionGroup>
            </table>
        );
    }
});

var AvailableAuction = React.createClass({
    selectTicket: function() { this.props.selectTicket(this.props.ticket); },
    render: function() {
        return (
            <tr className='availableAuction'>
                <ProjectInfoPanel />
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

var ProjectInfoPanel = React.createClass({
    render: function() {
        return (
            <td onClick={this.handleClick} className='projectInfoPanel'>
            <span>foobar/baz</span>
            <img src='img/rating-dots.svg'/>
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
            <form id='availableAuctionSearchBar'>
            <input type='text' placeholder='Search for tickets' value={this.props.filterText} onChange={this.handleChange} ref='filterTextInput'/>
            </form>
        );
    }
});

module.exports = AvailableAuctionsView;
