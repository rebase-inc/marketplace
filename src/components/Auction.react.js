let React = require('react');

// Actions
let AuctionActions = require('../actions/AuctionActions');

// Components
let FindTalentPanel = require('../components/FindTalentPanel.react');
let ProjectInfoPanel = require('../components/ProjectInfoPanel.react');
let Icons = require('../components/Icons.react');

let Auction = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        auction: React.PropTypes.object.isRequired,
        selectAuction: React.PropTypes.func.isRequired,
    },
    updateSearchText: function(skill, event) {
        switch (event.shiftKey) {
            case true: this.props.changeSearchText(this.props.searchText + ' ' + skill); break;
            case false: this.props.changeSearchText(skill); break;
        }
        event.stopPropagation();
    },
    render: function() {
        let props = { 
            auction: this.props.auction, 
            selectAuction: this.props.selectAuction,
            updateSearchText: this.updateSearchText,
        };
        switch (this.props.currentRole.type) {
            case 'manager': return <ManagerViewAuction {...props} />; break;
            case 'contractor': return <DeveloperViewAuction {...props} />; break;
            default: console.warn('Invalid role type: ' + this.props.currentRole.type); break;
        }
    }
});

let DeveloperViewAuction = React.createClass({
    propTypes: {
        auction: React.PropTypes.object.isRequired,
        selectAuction: React.PropTypes.func.isRequired,
        updateSearchText: React.PropTypes.func.isRequired,
    },
    render: function() {
        return (
            <tr className='auction' onClick={this.props.selectAuction.bind(null, this.props.auction.id)}>
                <ProjectInfoPanel ticket={this.props.auction.ticket} />
                <td ref='titlePanel' className='titlePanel'>{this.props.auction.ticket.title}</td>
                <td className='skillsRequiredPanel'>
                    <div className='skills'>
                        { Object.keys(!!this.props.auction.ticket.skill_requirement ? this.props.auction.ticket.skill_requirement.skills : {} ).map((skill) =>
                           <div key={skill} className='skill' onClick={this.props.updateSearchText.bind(null, skill)}>{skill}</div>) }
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

let ManagerViewAuction = React.createClass({
    propTypes: {
        auction: React.PropTypes.object.isRequired,
        selectAuction: React.PropTypes.func.isRequired,
        updateSearchText: React.PropTypes.func.isRequired,
    },
    getInitialState: () => ({currentDateTime: new Date()}),
    componentDidMount: function() {
        this._timer = setInterval(() => this.setState({currentDateTime : new Date()}), 2000);
    },
    componentWillUnmount: function() {
        clearInterval(this._timer);
    },
    render: function() {
        let expires = new Date(this.props.auction.expires);
        let minutesRemaining = Math.max(0, (expires - this.state.currentDateTime) / (1000*60));
        return (
            <tr className='auction' onClick={this.props.selectAuction.bind(null, this.props.auction.id)}>
                <td className='timeRemainingPanel'>
                    <span>AUCTION ENDS</span>
                    <Icons.Timer minutesRemaining={minutesRemaining}/>
                </td>
                <td className='titlePanel'>{this.props.auction.ticket.title}</td>
                <td className='talentOverviewPanel'><Icons.FindTalentOverview auction={this.props.auction}/></td>
                <td className='skillsRequiredPanel'>
                    <div className='skills'>
                        { Object.keys(!!this.props.auction.ticket.skill_requirement ? this.props.auction.ticket.skill_requirement.skills : {} ).map((skill) =>
                           <div key={skill} className='skill' onClick={this.props.updateSearchText.bind(null, skill)}>{skill}</div>) }
                    </div>
                </td>
                <td className='budgetPanel'>
                    <span>BUDGET</span>
                    <span>{'$' + this.props.auction.ticket_set.bid_limits[0].price}</span>
                </td>
            </tr>
        );
    }
});

module.exports = Auction;
