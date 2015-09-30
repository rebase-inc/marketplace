var React = require('react');

// Actions
var AuctionActions = require('../actions/AuctionActions');

// Components
var FindTalentPanel = require('../components/FindTalentPanel.react');
var ProjectInfoPanel = require('../components/ProjectInfoPanel.react');
var Icons = require('../components/Icons.react');

var Auction = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        auction: React.PropTypes.object.isRequired,
        selectAuction: React.PropTypes.func.isRequired,
        findTalent: React.PropTypes.func.isRequired,
    },
    componentDidMount: function() {
        setTimeout(AuctionActions.getAuctionDetail.bind(null, this.props.auction.id), 0);
    },
    render: function() {
        return (
            <tr className='auction'>
                { this.props.currentRole.type == 'manager' ?
                    <td className='talentOverviewPanel'><Icons.FindTalentOverview auction={this.props.auction}/></td> :
                    <ProjectInfoPanel ticket={this.props.auction.ticket} /> }
                <td className='titlePanel'>{this.props.auction.ticket.title}</td>
                <td className='skillsRequiredPanel'>{this.props.auction.ticket.skillsRequired}</td>
                <td className='commentsPanel' onClick={this.props.selectAuction.bind(null, this.props.auction.id)}>
                    <Icons.Comment/>
                    <span>{this.props.auction.ticket.comments.length} Comments</span>
                </td>
            </tr>
        );
    }
});

module.exports = Auction;
