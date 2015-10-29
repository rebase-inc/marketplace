import React, { Component, PropTypes } from 'react';

import HaltWorkModal from './HaltWorkModal.react';
import ResumeWorkModal from './ResumeWorkModal.react';
import SubmitWorkModal from './SubmitWorkModal.react';
import DisputeWorkModal from './DisputeWorkModal.react';
import CompleteWorkModal from './CompleteWorkModal.react';
import ResolveMediationModal from './ResolveMediationModal.react';

import ContractHeader from './ContractHeader.react';
import TicketDetails from './TicketDetails.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';

export default class SingleContractView extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        roles: React.PropTypes.object.isRequired,
        contract: React.PropTypes.object.isRequired,
        unselect: React.PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { modalType: null, detailsOpen: false }
        this.toggleDetails = this.toggleDetails.bind(this);
    }

    toggleDetails(newState) {
        if (typeof(newState) == 'boolean') {
            this.setState({ detailsOpen: newState });
        } else {
            this.setState({ detailsOpen: !this.state.detailsOpen });
        }
    }

    // TODO: Refactor ugly modal handling
    openModal(type) {
        var modalTypes = ['halt_work', 'resume_work', 'ask_for_review', 'enter_mediation', 'mark_complete', 'fail', 'resolve_mediation'];
        if (modalTypes.indexOf(type) == -1) {
            console.warn('Invalid modal type! ', type);
            this.setState({modalType: null});
        } else {
            this.setState({modalType: type});
        }
    }

    _selectModal(type) {
        const props = {
            close: () => this.setState({ modalType: null }),
            contract: this.props.contract
        }
        switch (type) {
            case 'halt_work': return (<HaltWorkModal {...props}/>); break;
            case 'resume_work': return (<ResumeWorkModal {...props}/>); break;
            case 'ask_for_review': return (<SubmitWorkModal {...props}/>); break;
            case 'enter_mediation': return (<DisputeWorkModal {...props}/>); break;
            case 'mark_complete': return (<CompleteWorkModal {...props}/>); break;
            case 'resolve_mediation': return (<ResolveMediationModal {...props}/>); break;
            case null: return null; break;
        }
    }

    toggleDetails(newState) {
        if (typeof(newState) == 'boolean') {
            this.setState({ detailsOpen: newState });
        } else {
            this.setState({ detailsOpen: !this.state.detailsOpen });
        }
    }

    render() {
        var actions = {
            haltWork: () => this.openModal('halt_work'),
            resumeWork: () => this.openModal('resume_work'),
            askForReview: () => this.openModal('ask_for_review'),
            enterMediation: () => this.openModal('enter_mediation'),
            markComplete: () => this.openModal('mark_complete'),
            resolveMediation: () => this.openModal('resolve_mediation'),
        };
        const { role, user, contract, unselect } = this.props;

        return (
            <div className='contractView'>
                { this._selectModal(this.state.modalType) }
                <ContractHeader role={role} unselect={unselect} toggleDetails={this.toggleDetails} actions={actions} contract={contract}/>
                <TicketDetails hidden={!this.state.showDetails} ticket={contract.ticket} />
                <CommentList comments={contract.ticket.comments}/>
                <CommentBox submit={() => alert.bind(null, 'oops')}/>
            </div>
        );
    }
};
