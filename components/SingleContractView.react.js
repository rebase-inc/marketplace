import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ContractHeader from './ContractHeader.react';
import ContractStatusHeader from './ContractStatusHeader.react';
import CommentBox from './CommentBox.react';
import Comment from './Comment.react';
import DetailsPanel from './DetailsPanel.react';
import { humanReadableDate } from '../utils/date';
import { getContractTicket, getContractWork, getContractComments } from '../utils/getters';

export default class SingleContractView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        contract: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { detailsOpen: false };
        this.toggleDetails = this.toggleDetails.bind(this);
    }

    toggleDetails(newState) {
        if (typeof(newState) == 'boolean') {
            this.setState({ detailsOpen: newState });
        } else {
            this.setState({ detailsOpen: !this.state.detailsOpen });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.contract.id != prevProps.contract.id) {
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = 0;
        }
    }

    render() {
        const { contract, user, role, actions } = this.props;
        const ticket = getContractTicket(contract);
        const work = getContractWork(contract);
        const submitComment = actions.commentOnContract.bind(null, user, contract);
        return (
            <div className='singleView'>
                <ContractHeader actions={actions} contract={contract} role={role} />
                { getContractComments(contract).map( comment => <Comment comment={comment} key={comment.id} /> ) }
                { work.state == 'in_progress' ? <InProgressCommentBox submit={submitComment} work={work} user={user} role={role} actions={actions} /> : null }
                { work.state == 'in_review' ? <InReviewCommentBox submit={submitComment} work={work} user={user} role={role} actions={actions}  /> : null }
                { work.state == 'blocked' ? <BlockedCommentBox submit={submitComment} work={work} user={user} role={role} actions={actions}  /> : null }
                { work.state == 'in_mediation' ? <InMediationCommentBox submit={submitComment} work={work} juser={user} role={role} actions={actions}  /> : null }
            </div>
        );
    }
}

const InProgressCommentBox = (props) => {
    const { actions, role, user, work, submit } = props;
    return (
        <CommentBox submit={submit}>
            { role.type == 'contractor' ? <button data-okay onClick={actions.submitWork.bind(null, work)} key='submit'>Submit Work</button> : undefined }
            { role.type == 'contractor' ? <button data-warning onClick={actions.markWorkBlocked.bind(null, work)} data-alert key='blocked'>Mark Blocked</button> : undefined }
        </CommentBox>
    );
}

const InReviewCommentBox = (props) => {
    const { actions, role, user, work, submit } = props;
    return (
        <CommentBox submit={submit}>
            { role.type == 'manager' ? <button data-okay onClick={actions.acceptWork.bind(null, work)} key='accept'>Accept Work</button> : undefined }
            { role.type == 'manager' ? <button data-warning onClick={actions.disputeWork.bind(null, work)} data-alert key='dispute'>Dispute</button> : undefined }
        </CommentBox>
    );
}

const BlockedCommentBox = (props) => {
    const { actions, role, user, work, submit } = props;
    return (
        <CommentBox submit={submit}>
            <button data-alert onClick={actions.markWorkUnblocked.bind(null, work)} key='unblockWork'>Unblock</button>
        </CommentBox>
    );
}
