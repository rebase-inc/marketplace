var React = require('react');

// Utils
Fuse = require('../utils/Fuse');

// this should be put into the auction store so we don't have to reinstantiate the
// search object every time we change the search text
function searchAuctions(auctions, searchText) {
    var fuseSearch = new Fuse(auctions, {threshold: 0.35, keys: ['ticket.title', 'ticket.description', 'ticket.project.name', 'ticket.project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

var FindTalentView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        currentAuction: React.PropTypes.object.isRequired,
    },
    render: function() {
        var props = {
            selectAuction: this.props.selectAuction,
            currentRole: this.props.currentRole,
        }
        var makeTicketElement = function(auction) { return <Auction auction={auction} key={auction.id} {...props} />; }.bind(props);
        //var auctionIDs = !!this.props.searchText ? searchAuctions(this.props.allAuctions, this.props.searchText) : this.props.allAuctions.map(a => a.id);
        var fakePeople = [1,2,3,4,5];
        if (true) {
            return (
                <table id='talentList'>
                    <tbody>
                        { fakePeople.map(p => <Talent/>) }
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

module.exports = FindTalentView;
