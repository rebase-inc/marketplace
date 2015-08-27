// External
var React = require('react');
var _ = require('underscore');

// Stores
var ContractStore = require('../stores/ContractStore');

// Actions
var ContractActions = require('../actions/ContractActions');

// Components
var SearchBar = require('../components/SearchBar.react');
var SingleTicketView = require('../components/SingleTicketView.react');
var TicketHeader = require('../components/TicketHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');
var NothingHere = require('../components/NothingHere.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');

// Constants
var viewConstants = require('../constants/viewConstants');

// Icons
var Icons = require('../components/RebaseIcons.react');

var ContractView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return _.extend({ searchText: '' }, ContractStore.getState());
    },
    componentDidMount: function() {
        ContractStore.addChangeListener(this._onChange);
        setTimeout(ContractActions.getContractData, 0);
    },
    componentWillUnmount: function() {
        ContractStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(ContractStore.getState());
    },
    selectContract: function(contractID) {
        ContractActions.selectContract(contractID);
    },
    // this is probably not how we should be handling the searchText
    //handleUserInput: function(searchText) { this.setState({ searchText: searchText }); },
    render: function() {
        if (!!this.state.currentContract) {
            return <SingleContractView {...this.props} {...this.state} unselectContract={this.selectContract.bind(null, null)} />;
        } else {
            var props = _.extend({ selectContract: this.selectContract }, this.state, this.props);
            return (
                <div className='mainContent'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleSearchInput}/>
                    <ContractList {...props} />
                </div>
            );
        }
    }
});

var SingleContractView = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        currentContract: React.PropTypes.object.isRequired,
        unselectContract: React.PropTypes.func.isRequired,
    },
    render: function() {
        var ticket = this.props.currentContract.ticket_set.bid_limits[0].ticket_snapshot.ticket;
        var makeButton = function(props) {
            return <button onClick={props.onClick} className={props.className}>{props.text}</button>;
        }
        var buttons = [];
        switch (this.props.currentRole.type) {
            case 'contractor': buttons.push(<button onClick={this.props.bidNow}>Bid Now</button>); break;
            case 'manager': buttons.push(<button onClick={this.props.bidNow}>Find More Talent</button>); break;
        }
        return (
            <SingleTicketView {...this.props}>
                <TicketHeader goBack={this.props.unselectContract} title={ticket.title}>
                    {buttons}
                </TicketHeader>
                <CommentList comments={ticket.comments}/>
                <CommentBox ticket={ticket} user={this.props.currentUser} />
            </SingleTicketView>
        );
    }
});

var ContractList = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        selectContract: React.PropTypes.func.isRequired,
    },
    render: function() {
        var props = {
            selectContract: this.props.selectContract,
            currentRole: this.props.currentRole,
        }
        var titleMatchesText = function(contract) {
            return true; // until we make this actually work
            return contract.title.indexOf(this.props.searchText) != -1;
        }.bind(this);
        var makeTicketElement = function(contract) {
            return <Contract contract={contract} key={contract.id} {...props} />;
        }.bind(props);
        if (this.props.loadingContractData) {
            return <LoadingAnimation />;
        } else if (!this.props.allContracts.length) {
            return <NothingHere text={'You don\'t have any in progress work right now. Check out offered tickets to find some!'}/>
        } else {
            return (
                <table id='ticketList'>
                    <tbody>
                        { this.props.allContracts.filter(titleMatchesText).map(makeTicketElement) }
                    </tbody>
                </table>
            );
        }
    }
});

var Contract = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        contract: React.PropTypes.object.isRequired,
        selectContract: React.PropTypes.func.isRequired,
    },
    render: function() {
        var ticket = this.props.contract.bid.work_offers[0].ticket_snapshot.ticket;
        return (
            <tr className='ticket'>
                { this.props.currentRole.type == 'manager' ?
                    <FindTalentPanel ticket={ticket} /> :
                    <ProjectInfoPanel ticket={ticket} /> }
                <td className='titlePanel'>{ticket.title}</td>
                <td className='skillsRequiredPanel'>{ticket.skillsRequired}</td>
                <td className='commentsPanel' onClick={this.props.selectContract.bind(null, this.props.contract.id)}>
                    <Icons.Comment/>
                    <span>{ticket.comments.length} Comments</span>
                </td>
            </tr>
        );
    }
});

var ProjectInfoPanel = React.createClass({
    render: function() {
        var projectName = this.props.ticket.project.organization.name + '/' + this.props.ticket.project.name;
        return (
            <td onClick={this.handleClick} className='projectInfoPanel'>
            <span>{projectName}</span>
            <RatingStars rating={this.props.ticket.project.rating || 3} />
            </td>
        );
    }
});

var RatingStars = React.createClass({
    render: function() {
        var nearestHalf = Math.round(this.props.rating*2)/2;
        var fullStars = Math.floor(nearestHalf);
        var showHalfStar = (nearestHalf != fullStars);
        return (
            <div className='rating'>
                { _.range(fullStars).map(function(el, ind) { return <img key={'full-' + ind} src='img/star-10px.svg' /> }) }
                { showHalfStar ? <img key='half' src='img/half-star-10px.svg' /> : null }
                { _.range(5 - fullStars - showHalfStar).map(function(el, ind) { return <img key={'empty-' + ind} src='img/empty-star-10px.svg' /> }) }
            </div>
        );
    }
});

module.exports = ContractView;

