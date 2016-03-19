import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';
import ScoredProfilePicture from './ScoredProfilePicture.react';
import RatingStars from './RatingStars.react';
import ApproveIcon from './ApproveIcon.react';
import UndoIcon from './UndoIcon.react';
import WaitingIcon from './WaitingIcon.react';

function isUnapproved(auction, nomination) {
    return (auction.approved_talents.every(t => t.contractor.id != nomination.contractor.id));
}

function isWaitingForResponse(auction, nomination) {
    return (auction.bids.every(bid => bid.contractor.id != nomination.contractor.id));
}

function isRejected(auction, nomination) {
    return (auction.bids.some(bid => bid.contractor.id == nomination.contractor.id && bid.contract));
}

export default class Talent extends Component {
    render() {
        const { nomination, auction, approve, select, undo } = this.props;
        let hiddenIcon;
        let statusIcon;
        if (isUnapproved(auction, nomination)) {
            hiddenIcon = <ApproveIcon onClick={approve} />;
            statusIcon = null;
        } else if (isWaitingForResponse(auction, nomination)) {
            hiddenIcon = <UndoIcon onClick={undo} />;
            statusIcon = <WaitingIcon />;
        } else if (isRejected(auction, nomination)) {
            hiddenIcon = null;
            statusIcon = <WaitingIcon />;
        } else {
            hiddenIcon = null;
            statusIcon = <ApproveIcon />;
        }
        return (
            <ListElement
                className={'talent'}
                title={<div>{nomination.contractor.user.name}{statusIcon}</div>}
                subtitle={ Object.keys(nomination.contractor.skill_set.skills).join(' ') }
                prefix={<RatingStars rating={nomination.contractor.rating ? nomination.contractor.rating / 2 : 3.5} />}
                icon={<ScoredProfilePicture user={nomination.contractor.user} score={nomination.job_fit ? nomination.job_fit.score : null} />}
                hidden={hiddenIcon}
                handleClick={select}
                />
        );
    }
}
