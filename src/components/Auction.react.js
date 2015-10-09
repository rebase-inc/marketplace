var React = require('react');

// Actions
var AuctionActions = require('../actions/AuctionActions');

// Components
var FindTalentPanel = require('../components/FindTalentPanel.react');
var ProjectInfoPanel = require('../components/ProjectInfoPanel.react');
var Icons = require('../components/Icons.react');

var MonthNames = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']


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
    getInitialState: () => ({currentDateTime: new Date()}),
    componentDidMount: function() {
        this._timer = setInterval(() => this.setState({currentDateTime : new Date()}), 4000);
    },
    componentWillUnmount: function() {
        clearInterval(this._timer);
    },
    render: function() {
        let expires = new Date(this.props.auction.expires);
        let minutesRemaining = (expires - this.state.currentDateTime) / (1000*60);
        return (
            <tr className='auction' onClick={this.props.selectAuction.bind(null, this.props.auction.id)}>
                { this.props.currentRole.type == 'manager' ?
                    <td className='talentOverviewPanel'><Icons.FindTalentOverview auction={this.props.auction}/></td>
                    : <ProjectInfoPanel ticket={this.props.auction.ticket} />
                }
                <td className='titlePanel'>{this.props.auction.ticket.title}</td>
                <td className='skillsRequiredPanel'>
                    <div className='skills'>
                        { Object.keys(!!this.props.auction.ticket.skill_requirement ? this.props.auction.ticket.skill_requirement.skills : {} ).map((skill) =>
                           <div key={skill} className='skill' onClick={this.changeSearchText.bind(null, skill)}>{skill}</div>) }
                    </div>
                </td>
                { this.props.currentRole.type == 'manager' ?
                    <td className='timeRemainingPanel'><span>AUCTION ENDS</span><Icons.Timer minutesRemaining={minutesRemaining}/></td> : null
                }
                { this.props.currentRole.type == 'manager' ?
                    <td className='budgetPanel'>
                        <span>BUDGET</span>
                        <span>{'$' + this.props.auction.ticket_set.bid_limits[0].price}</span>
                    </td> :
                    <td className='commentsPanel'>
                        <Icons.Comment/>
                        <span>{this.props.auction.ticket.comments.length} Comments</span>
                    </td>
                }

            </tr>
        );
    }
});

module.exports = Auction;
