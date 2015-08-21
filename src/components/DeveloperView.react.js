var React = require('react/addons');
var _ = require('underscore');

var Icons = require('../components/RebaseIcons.react');
var AuctionStore = require('../stores/AuctionStore');
var RebaseActions = require('../actions/RebaseActions');
var SingleItemView = require('../components/SingleItemView.react');
var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var DeveloperView = React.createClass({
    getInitialState: function() {
        return _.extend({ filterText: '' }, AuctionStore.getState());
    },
    getDataIfNeeded: function() {
        RebaseActions.getAuctionData();
    },
    componentDidMount: function() {
        AuctionStore.addChangeListener(this._onChange);
        this.getDataIfNeeded();
    },
    componentWillUnmount: function() {
        AuctionStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(AuctionStore.getState());
    },
    handleUserInput: function(filterText) { this.setState({ filterText: filterText }); },
    selectAuction: function(auction) {
        AuctionStore.select(auction);
        this._onChange();
    },
    unselectAuction: function() {
        this.selectAuction(null);
    },
    render: function() {
        if (!!this.state.currentAuction) {
            var props = {
                backAction: this.unselectAuction,
                buttonAction: this.props.openModal,
                currentRole: this.props.currentRole,
                auction: this.state.currentAuction,
                user: this.props.user,
            }
            return <SingleItemView {...props} />;
        } else {
            return (
                <div id='availableAuctionsView' className='mainContent'>
                <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
                { !this.state.availableAuctions.length ? <LoadingAnimation /> :
                    <AvailableAuctionsList
                    selectAuction={this.selectAuction}
                    availableAuctions={this.state.availableAuctions}
                    filterText={this.state.filterText}/>
                }
                </div>
            );
        }
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
    handleScrollPosition: function() {
        handleScrollShadows(this);
    },
    componentDidUpdate: function() {
        this.handleScrollPosition();
    },
    componentDidMount: function() {
        this.handleScrollPosition();
        this.getDOMNode().addEventListener('scroll', this.handleScrollPosition, false);
    },
    componentWillUnmount: function() {
        this.getDOMNode().removeEventListener('scroll', this.handleScrollPosition, false);
    },
    render: function() {
        var availableAuctionElements = [];
        this.props.availableAuctions.forEach(function(auction, ind) {
            var _ticket = auction.ticket_set.bid_limits[0].ticket_snapshot.ticket;
            if ( _ticket.title.indexOf(this.props.filterText) == -1 ) { return; }
            availableAuctionElements.push(<AvailableAuction auction={auction} key={auction.id} selectAuction={this.props.selectAuction}/>);
        }.bind(this));

        return (
            <table id='availableAuctionList' ref='availableAuctionList'>
            <ReactCSSTransitionGroup component='tbody' transitionName='example'>
            {availableAuctionElements}
            </ReactCSSTransitionGroup>
            </table>
        );
    }
});

var AvailableAuction = React.createClass({
    selectAuction: function() { this.props.selectAuction(this.props.auction); },
    render: function() {
        var _ticket = this.props.auction.ticket_set.bid_limits[0].ticket_snapshot.ticket;
        return (
            <tr className='availableAuction'>
                <ProjectInfoPanel />
                <td className='titlePanel'>{_ticket.title}</td>
                <td className='skillsRequiredPanel'>{_ticket.skillsRequired}</td>
                <td className='commentsPanel' onClick={this.selectAuction}>
                    <Icons.Comment/>
                    <span>{_ticket.comments.length} Comments</span>
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

module.exports = DeveloperView;
