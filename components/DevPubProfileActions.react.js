import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { isUnapproved, isWaitingForResponse, isRejected } from '../utils/nomination';

export default class DevPubProfileActions extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        auction: PropTypes.object.isRequired,
        nomination: PropTypes.object.isRequired,
    }

    render() {
        const { actions, auction, nomination } = this.props;
        const approve = (event) => actions.approveNomination(auction, nomination) && event.stopPropagation();
        const undo =    (event) => actions.makeNotification('Not implemented yet') && event.stopPropagation();
        let className = null;
        let label = null;
        let _onClick=null;
        if (isUnapproved(auction, nomination)) {
            className='approvalButtonUnapproved';
            label = 'approve';
            _onClick = approve;
        } else if (isWaitingForResponse(auction, nomination)) {
            className = 'approvalButtonWaiting';
            label = 'waiting';
        } else if (isRejected(auction, nomination)) {
            label = 'rejected';
        } else {
            className='approvalButtonApproved';
            label = 'undo approval';
            _onClick = undo;
        }
        return (
            <div className='devPubProfileActions' id='devActions'>
                <button className={className} id='devActionApprove' onClick={_onClick} >{label}</button>
                <button className='devPubProfileAction' id='devActionHide' onClick={actions.hideNomination.bind(null, auction, nomination)} >hide</button>
            </div>
        );
    }
}
