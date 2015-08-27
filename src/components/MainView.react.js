var React = require('react');
var _ = require('underscore');

var TicketView = require('../components/TicketView.react');
var AuctionView = require('../components/AuctionView.react');
var ContractView = require('../components/ContractView.react');

var viewConstants = require('../constants/viewConstants');

var MainView = React.createClass({
    propTypes: {
        currentView: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    render: function() {
        switch (this.props.currentView.type) {
            case viewConstants.ViewTypes.NEW: return <TicketView {...this.props} />; break;
            case viewConstants.ViewTypes.OFFERED: return <AuctionView {...this.props} />; break;
            case viewConstants.ViewTypes.IN_PROGRESS: return <ContractView {...this.props} />; break;
            //case ViewConstants.VIEW_TYPES.COMPLETED: return <ReviewView />; break;
            default: return <ErrorPage />; break;
        }
    }
});

var ErrorPage = React.createClass({ render: function() { return <div>Error! Please restart app!</div>; } });

module.exports = MainView;
