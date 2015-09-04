// External
var React = require('react');
var _ = require('underscore');

// Stores
var ContractStore = require('../stores/ContractStore');

// Actions
var ContractActions = require('../actions/ContractActions');

// Components
var SearchBar = require('../components/SearchBar.react');
var TicketHeader = require('../components/TicketHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');
var NothingHere = require('../components/NothingHere.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');
var ModalContainer = require('../components/ModalContainer.react');

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
                <div className='contractView'>
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
    getInitialState: function() {
        return {
            modalOpen: false,
            modalType: '',
        };
    },
    openMarkCompleteModal: function() {
        this.setState({
            modalOpen: true ,
            modalType: 'markComplete',
        });
    },
    openMarkBlockedModal: function() {
        this.setState({
            modalOpen: true ,
            modalType: 'markBlocked',
        });
    },
    openMarkUnblockedModal: function() {
        this.setState({
            modalOpen: true ,
            modalType: 'markUnblocked',
        });
    },
    openResolveMediationModal: function() {
        this.setState({
            modalOpen: true ,
            modalType: 'resolveMediation',
        });
    },
    closeModal: function() {
        this.setState({ modalOpen: false });
    },
    markComplete: function(reason) {
        ContractActions.markComplete(this.props.currentUser, this.props.currentContract, reason);
        this.closeModal();
    },
    markBlocked: function(reason) {
        ContractActions.markBlocked(this.props.currentUser, this.props.currentContract, reason);
        this.closeModal();
    },
    markUnblocked: function(reason) {
        ContractActions.markUnblocked(this.props.currentUser, this.props.currentContract, reason);
        this.closeModal();
    },
    render: function() {
        var ticket = this.props.currentContract.bid.work_offers[0].ticket_snapshot.ticket;
        var makeButton = function(props) {
            return <button onClick={props.onClick} className={props.className}>{props.text}</button>;
        }
        var buttons = [];
        var headerClass;
        var modal;
        switch (this.props.currentRole.type) {
            case 'contractor':
                var props = {
                    markBlocked: this.markBlocked,
                    markUnblocked: this.markUnblocked,
                    markComplete: this.markComplete,
                    closeModal: this.closeModal,
                }
                modal = <ContractModal {..._.extend(props, this.state, this.props)} />
                switch (this.props.currentContract.bid.work_offers[0].work.state) {
                    case 'in_progress':
                        buttons.push(<button onClick={this.openMarkCompleteModal}>Finished</button>);
                        buttons.push(<button onClick={this.openMarkBlockedModal} className='needsResolution'>Blocked</button>);
                        break;
                    case 'in_review':
                        headerClass = 'notification';
                        break;
                    case 'blocked':
                        headerClass = 'needsResolution';
                        buttons.push(<button onClick={this.openMarkUnblockedModal}>Unblock</button>);
                        break;
                    case 'in_mediation':
                        headerClass = 'needsResolution';
                        buttons.push(<button onClick={this.openResolveMediationModal}>Unblock</button>);
                        break;
                    default: break;
                }
                break;
            case 'manager': buttons.push(<button onClick={this.props.bidNow}>Find More Talent</button>); break;
        }
        return (
            <div className='contractView'>
                { this.state.modalOpen ? modal : null }
                <TicketHeader className={headerClass} goBack={this.props.unselectContract} title={ticket.title}>
                    {buttons}
                </TicketHeader>
                <CommentList comments={ticket.comments}/>
                <CommentBox ticket={ticket} user={this.props.currentUser} />
            </div>
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
        if (!!this.props.allContracts.length) {
            return (
                <table id='ticketList'>
                    <tbody>
                        { this.props.allContracts.filter(titleMatchesText).map(makeTicketElement) }
                    </tbody>
                </table>
            );
        } else if (this.props.loadingContractData) {
            return <LoadingAnimation />;
        } else {
            return <NothingHere text={'You don\'t have any in progress work right now. Check out offered tickets to find some!'}/>;
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
        var state = this.props.contract.bid.work_offers[0].work.state
        var className;
        switch (state) {
            case 'in_progress': className = 'neutral'; break;
            case 'in_review': className = 'notification'; break;
            case 'blocked': className = 'needsResolution'; break;
            case 'in_mediation': className = 'needsResolution'; break;
        }
        return (
            <tr className='ticket'>
                <td className={'statusPanel ' + className}></td>
                <ProjectInfoPanel ticket={ticket} />
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

var ContractModal = React.createClass({
    getInitialState: function() {
        return {
            text: '',
            stateChangeSubmitted: false,
            missingInput: false,
        }
    },
    markBlocked: function() {
        var reason = this.refs.comment.getDOMNode().value;
        this.setState({ missingInput: !reason.length });
        if (!reason.length) { return; }
        this.props.markBlocked(reason);
    },
    markUnblocked: function() {
        var reason = this.refs.comment.getDOMNode().value;
        this.setState({ missingInput: !reason.length });
        if (!reason.length) { return; }
        this.props.markUnblocked(reason);
    },
    markComplete: function() {
        var reason = this.refs.comment.getDOMNode().value;
        this.setState({ missingInput: !reason.length });
        this.props.markComplete(reason);
    },
    render: function() {
        switch (this.props.modalType) {
            case 'markComplete':
                return (
                    <ModalContainer>
                        <div onClick={this.props.closeModal} id='modalClose'>
                            <img src='img/modal-close.svg'/>
                        </div>
                        <h3>All done?</h3>
                        <h4>The task will be sent to the client for approval.</h4>
                        <textarea className={this.state.missingInput ? 'error' : null} ref='comment' placeholder='Leave a short comment describing the work you did (optional)'/>
                        <button onClick={this.markComplete}>Submit Work</button>
                    </ModalContainer>
                );
                break;
            case 'markBlocked':
                return (
                    <ModalContainer>
                        <div onClick={this.props.closeModal} id='modalClose'>
                            <img src='img/modal-close.svg'/>
                        </div>
                        <h3>Blocked?</h3>
                        <h4>Let the client know you need something to continue</h4>
                        <textarea className={this.state.missingInput ? 'error' : null} ref='comment' placeholder='Please leave a comment describing why you are blocked.'/>
                        <button className='needsResolution' onClick={this.markBlocked}>Mark Blocked</button>
                    </ModalContainer>
                );
                break;
            case 'markUnblocked':
                return (
                    <ModalContainer>
                        <div onClick={this.props.closeModal} id='modalClose'>
                            <img src='img/modal-close.svg'/>
                        </div>
                        <h3>Not blocked anymore?</h3>
                        <h4>You'll be able to resume work on this task</h4>
                        <textarea className={this.state.missingInput ? 'error' : null} ref='comment' placeholder='Please leave a comment describing why you are no longer blocked.'/>
                        <button className='needsResolution' onClick={this.markUnblocked}>Remove Block</button>
                    </ModalContainer>
                );
                break;
            case 'resolveMediation':
                return (
                    <ModalContainer>
                        <div onClick={this.props.closeModal} id='modalClose'>
                            <img src='img/modal-close.svg'/>
                        </div>
                        <h3>The client doesn't agree that you're finished with the work.</h3>
                        <h4>How do you want to resolve? You should discuss with the client before making a final decision.</h4>
                        <textarea className={this.state.missingInput ? 'error' : null} ref='comment' placeholder='Leave a comment explaining your decision'/>
                        <button className='needsResolution' onClick={this.giveUp}>Give up</button>
                        <button className='needsResolution' onClick={this.dispute}>Dispute</button>
                        <button className='needsResolution' onClick={this.returnToWork}>Fix client issue</button>
                    </ModalContainer>
                );
                break;
            default: throw 'wtf'; break;
        }
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

