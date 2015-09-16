var React = require('react');
var _ = require('underscore');

// Utils
var Fuse = require('../utils/Fuse');

var Talent = require('../components/Talent.react');
var TalentStore = require('../stores/TalentStore');
var TalentActions = require('../actions/TalentActions');

var FindTalentView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        currentAuction: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return _.extend({ searchText: '' }, TalentStore.getState());
    },
    componentDidMount: function() {
        TalentStore.addChangeListener(this._onChange);
        setTimeout(TalentActions.getTalentData, 0);
    },
    componentWillUnmount: function() {
        TalentStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(TalentStore.getState());
    },
    render: function() {
        var props = {
            selectAuction: this.props.selectAuction,
            currentRole: this.props.currentRole,
        }
        if (true) {
            return (
                <table id='talentList'>
                    <tbody>
                        { this.state.allTalent.map(talent => <Talent nomination={talent}/>) }
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
