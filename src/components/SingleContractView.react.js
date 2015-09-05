var React = require('react');

// Components
var ContractHeader = require('../components/ContractHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');
var HaltWorkModal = require('../components/HaltWorkModal.react');
var ResumeWorkModal = require('../components/ResumeWorkModal.react');

var SingleContractView = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        currentContract: React.PropTypes.object.isRequired,
        unselectContract: React.PropTypes.func.isRequired,
    },
    getInitialState: function() {
        return { modalType: null, };
    },
    closeModal: function() {
        this.setState({ modalType: null });
    },
    openModal: function(type) {
        var modalTypes = ['halt_work', 'resume_work', 'ask_for_review', 'enter_mediation', 'mark_complete', 'fail'];
        if (modalTypes.indexOf(type) == -1) {
            console.warn('Invalid modal type! ', type);
            this.setState({modalType: null});
        } else {
            this.setState({modalType: type});
        }
    },
    _selectModal: function(type) {
        var props = {
            closeModal: this.closeModal,
            currentUser: this.props.currentUser,
            currentContract: this.props.currentContract,
        }
        switch (type) {
            case 'halt_work': return (<HaltWorkModal {...props}/>); break;
            case 'resume_work': return (<ResumeWorkModal {...props}/>); break;
            case 'ask_for_review': return (<SubmitWorkModal {...props}/>); break;
            case 'enter_mediation': return; break;
            case 'mark_complete': return; break;
            case 'fail': return; break;
            case null: return null; break;
            default: console.warn('Invalid modal type! ', type); break;
        }
    },
    render: function() {
        return (
            <div className='contractView'>
                { this._selectModal(this.state.modalType) }
                <ContractHeader currentRole={this.props.currentRole} goBack={this.props.unselectContract} openModal={this.openModal} currentContract={this.props.currentContract}/>
                <CommentList comments={this.props.currentContract.ticket.comments}/>
                <CommentBox ticket={this.props.currentContract.ticket} user={this.props.currentUser} />
            </div>
        );
    }
});

module.exports = SingleContractView;
