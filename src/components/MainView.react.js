var React = require('react');
var _ = require('underscore');

var TicketView = require('../components/TicketView.react');
var AuctionView = require('../components/AuctionView.react');
var viewConstants = require('../constants/viewConstants');

var MainView = React.createClass({
    propTypes: {
        currentView: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
    },
    render: function() {
        switch (this.props.currentView.type) {
            case viewConstants.ViewTypes.NEW: return <TicketView {...props} />; break;
            case viewConstants.ViewTypes.OFFERED: return <AuctionView />; break;
            //case ViewConstants.VIEW_TYPES.IN_PROGRESS: return <ContractView />; break;
            //case ViewConstants.VIEW_TYPES.COMPLETED: return <ReviewView />; break;
            default: return <ErrorPage />; break;
        }
    }
});

var ErrorPage = React.createClass({ render: function() { return <div>Error! Please refresh page!</div>; } });

module.exports = MainView;
