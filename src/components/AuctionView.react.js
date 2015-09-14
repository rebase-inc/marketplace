// External
var React = require('react');
var _ = require('underscore');

// Stores
var AuctionStore = require('../stores/AuctionStore');

// Actions
var AuctionActions = require('../actions/AuctionActions');

// Components
var SearchBar = require('../components/SearchBar.react');
var AuctionList = require('../components/AuctionList.react');
var SingleAuctionView = require('../components/SingleAuctionView.react');

var AuctionView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return _.extend({ searchText: '', viewingTalent: false }, AuctionStore.getState());
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
    render: function() {
        var props = {
            loading: this.state.loading,
            currentUser: this.props.currentUser,
            currentRole: this.props.currentRole,
            searchText: this.state.searchText,
        }
        switch (!!this.state.currentAuction) {
            case true:
                props.unselectAuction = AuctionActions.selectAuction.bind(null, null);
                props.currentAuction = this.state.currentAuction;
                props.findTalent = this.findTalent;
                props.viewingTalent = this.state.viewingTalent;
                props.findTalent = this.findTalent;
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
