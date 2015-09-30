var React = require('react');

// Components
var ContractHeader = require('../components/ContractHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');
var HaltWorkModal = require('../components/HaltWorkModal.react');
var ResumeWorkModal = require('../components/ResumeWorkModal.react');
var SubmitWorkModal = require('../components/SubmitWorkModal.react');
var CompleteWorkModal = require('../components/CompleteWorkModal.react');
var DisputeWorkModal = require('../components/DisputeWorkModal.react');
var ResolveMediationModal = require('../components/ResolveMediationModal.react');
var TicketDetails = require('../components/TicketDetails.react');

var SingleContractView = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        currentContract: React.PropTypes.object.isRequired,
        unselectContract: React.PropTypes.func.isRequired,
    },
    getInitialState: () => ({ modalType: null, showDetails: false }),
    closeModal: function() {
        this.setState({ modalType: null });
    },
    openModal: function(type) {
        var modalTypes = ['halt_work', 'resume_work', 'ask_for_review', 'enter_mediation', 'mark_complete', 'fail', 'resolve_mediation'];
        if (modalTypes.indexOf(type) == -1) {
            console.warn('Invalid modal type! ', type);
            this.setState({modalType: null});
        } else {
            this.setState({modalType: type});
        }
    },
    componentWillMount: function() {
        this.haltWork = this.openModal.bind(null, 'halt_work');
        this.resumeWork = this.openModal.bind(null, 'resume_work');
        this.askForReview = this.openModal.bind(null, 'ask_for_review');
        this.enterMediation = this.openModal.bind(null, 'enter_mediation');
        this.markComplete = this.openModal.bind(null, 'mark_complete');
        this.resolveMediation = this.openModal.bind(null, 'resolve_mediation');
    },
    _selectModal: function(type) {
        var props = {
            closeModal: this.closeModal,
            currentUser: this.props.currentUser,
            currentRole: this.props.currentRole,
            currentContract: this.props.currentContract,
        }
        switch (type) {
            case 'halt_work': return (<HaltWorkModal {...props}/>); break;
            case 'resume_work': return (<ResumeWorkModal {...props}/>); break;
            case 'ask_for_review': return (<SubmitWorkModal {...props}/>); break;
            case 'enter_mediation': return (<DisputeWorkModal {...props}/>); break;
            case 'mark_complete': return (<CompleteWorkModal {...props}/>); break;
            case 'resolve_mediation': return (<ResolveMediationModal {...props}/>); break;
            case null: return null; break;
            default: console.warn('Invalid modal type! ', type); break;
        }
    },
    toggleDetails: function(state) {
        typeof(state) === 'boolean' ? this.setState({ showDetails: state }) : this.setState({ showDetails: !this.state.showDetails });
    },
    render: function() {
        var actions = {
            haltWork: this.haltWork,
            resumeWork: this.resumeWork,
            askForReview: this.askForReview,
            enterMediation: this.enterMediation,
            markComplete: this.markComplete,
            resolveMediation: this.resolveMediation,
        }
        return (
            <div className='contractView'>
                { this._selectModal(this.state.modalType) }
                <ContractHeader currentRole={this.props.currentRole} 
                    goBack={this.props.unselectContract} 
                    toggleDetails={this.toggleDetails} 
                    actions={actions} 
                    currentContract={this.props.currentContract}/>
                <TicketDetails hidden={!this.state.showDetails} ticket={this.props.currentContract.ticket} />
                <CommentList comments={this.props.currentContract.ticket.comments}/>
                <CommentBox ticket={this.props.currentContract.ticket} user={this.props.currentUser} />
            </div>
        );
    }
});

module.exports = SingleContractView;
