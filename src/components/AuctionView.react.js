// External
var React = require('react');
var _ = require('underscore');

// Constants
var ViewTypes = require('../constants/ViewConstants').ViewTypes;

// Stores
var AuctionStore = require('../stores/AuctionStore');

// Actions
var AuctionActions = require('../actions/AuctionActions');
let UserActions = require('../actions/UserActions');

// Components
var SearchBar = require('../components/SearchBar.react');
var AuctionList = require('../components/AuctionList.react');
var SingleAuctionView = require('../components/SingleAuctionView.react');
var NothingHere = require('../components/NothingHere.react');

var AuctionView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return _.extend({
            searchText: '',
            viewingTalent: !!(this.props.currentRole.type == 'manager')
        }, AuctionStore.getState());
    },
    _onChange: function() {
        this.setState(AuctionStore.getState());
    },
    componentDidMount: function() {
        AuctionStore.addChangeListener(this._onChange);
        setTimeout(AuctionActions.getAuctionData, 0);
    },
    componentWillUnmount: function() {
        AuctionStore.removeChangeListener(this._onChange);
    },
    handleUserInput: function(searchText) {
        this.setState({ searchText: searchText });
    },
    findTalent: function(auctionID) {
        if (!!auctionID) {  TicketActions.selectAuction(auctionID); }
        this.setState({ viewingTalent: true });
    },
    leaveTalentView: function() {
        this.setState({ viewingTalent: false });
    },
    render: function() {
        var props = {
            loading: this.state.loading,
            currentUser: this.props.currentUser,
            currentRole: this.props.currentRole,
            searchText: this.state.searchText,
        }
        // If there aren't any auctions to display and we're not in the process of finding any,
        // display the nothing here screen, with some actions to help the user get out of this state.
        if (!this.state.allAuctions.length && !this.state.loading) {
            return (
                <NothingHere>
                    <h3>You don't have any offered tickets</h3>
                    { this.props.currentRole.type == 'manager' ?  <button onClick={UserActions.selectView.bind(null, ViewTypes.NEW)}>View New Tickets</button> : null }
                </NothingHere>
            );
        }
        switch (!!this.state.currentAuction) {
            case true:
                props.unselectAuction = AuctionActions.selectAuction.bind(null, null);
                props.currentAuction = this.state.currentAuction;
                props.findTalent = this.findTalent;
                props.viewingTalent = this.state.viewingTalent;
                props.findTalent = this.findTalent;
                props.leaveTalentView = this.leaveTalentView;
                return <SingleAuctionView {...props} />;
                break;
            default:
                props.allAuctions = this.state.allAuctions;
                props.selectAuction = AuctionActions.selectAuction;
                props.searchText = this.state.searchText;
                props.findTalent = this.findTalent;
                return (
                    <div className='auctionView'>
                        <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}/>
                        <AuctionList {...props} />
                    </div>
                );
                break;
        }
    }
});

module.exports = AuctionView;
