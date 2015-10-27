var React = require('react');
var _ = require('underscore');

// Utils
var Fuse = require('../utils/Fuse');

var Talent = require('../components/Talent.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');

var TalentStore = require('../stores/TalentStore');
var AuctionActions = require('../actions/AuctionActions');

var FindTalentView = React.createClass({
    propTypes: {
        currentAuction: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return _.extend({ searchText: '' }, TalentStore.getState(this.props.currentAuction.id));
    },
    componentDidMount: function() {
        TalentStore.addChangeListener(this._onChange);
        setTimeout(AuctionActions.getAuctionDetail.bind(null, this.props.currentAuction.id), 0);
    },
    componentWillUnmount: function() {
        TalentStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(TalentStore.getState(this.props.currentAuction.id));
    },
    render: function() {
        var props = {
            selectAuction: this.props.selectAuction,
            currentRole: this.props.currentRole,
        }
        return (
            <table className='contentList'>
                <tbody>
                    { this.state.allTalent.map(talent => <Talent key={talent.id} currentAuction={this.props.currentAuction} nomination={talent}/>) }
                </tbody>
            </table>
        );
    }
});

module.exports = FindTalentView;