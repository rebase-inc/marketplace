var React = require('react');

// Components
var NothingHere = require('../components/NothingHere.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');
var Auction = require('../components/Auction.react');

var AuctionList = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        selectAuction: React.PropTypes.func.isRequired,
        searchText: React.PropTypes.string.isRequired,
        findTalent: React.PropTypes.func.isRequired,
    },
    render: function() {
        var props = {
            selectAuction: this.props.selectAuction,
            currentRole: this.props.currentRole,
            findTalent: this.props.findTalent,
        }
        var makeTicketElement = function(auction) { return <Auction auction={auction} key={auction.id} {...props} />; }.bind(props);
        var auctionIDs = !!this.props.searchText ? searchAuctions(this.props.allAuctions, this.props.searchText) : this.props.allAuctions.map(a => a.id);
        if (!!this.props.allAuctions.length) {
            return (
                <table>
                    <tbody>
                        { this.props.allAuctions.filter(auction => auctionIDs.indexOf(auction.id) != -1).map(makeTicketElement) }
                    </tbody>
                </table>
            );
        } else if (this.props.loading) {
            return <LoadingAnimation />;
        } else {
            return <NothingHere text={'We\'re working to find some great auctions for you!'}/>;
        }
    }
});

module.exports = AuctionList;
