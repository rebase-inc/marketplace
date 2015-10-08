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
    changeSearchText: function(skill, event) {
        switch (event.shiftKey) {
            case true: this.props.changeSearchText(this.props.searchText + ' ' + skill); break;
            case false: this.props.changeSearchText(skill); break;
        }
        event.stopPropagation();
    },
    render: function() {
        return (
            <tr className='auction' onClick={this.props.selectAuction.bind(null, this.props.auction.id)}>
                { this.props.currentRole.type == 'manager' ?
                    <FindTalentPanel /> :
                    <ProjectInfoPanel ticket={this.props.auction.ticket} /> }
                <td className='titlePanel'>{this.props.auction.ticket.title}</td>
                { this.props.currentRole.type == 'manager' ? <td className='talentOverviewPanel'><Icons.FindTalentOverview auction={this.props.auction}/></td> : null }
                <td className='skillsRequiredPanel'>
                    <div className='skills'>
                        { Object.keys(this.props.auction.ticket.skill_requirement.skills).map((skill) =>
                           <div key={skill} className='skill' onClick={this.changeSearchText.bind(null, skill)}>{skill}</div>) }
                    </div>
                </td>
                <td className='commentsPanel'>
                    <Icons.Comment/>
                    <span>{this.props.auction.ticket.comments.length} Comments</span>
                </td>
            </tr>
        );
    }
});

module.exports = Auction;
