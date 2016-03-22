import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuctionActions from '../actions/AuctionActions';
import * as NotificationActions from '../actions/NotificationActions';

import Notes from './Notes.react';
import ScoredProfilePicture from './ScoredProfilePicture.react';
import SkillsRadar from './SkillsRadar.react';
import RatingStars from './RatingStars.react';
import CloseIcon from './CloseIcon.react';

import { isUnapproved, isWaitingForResponse, isRejected } from '../utils/nomination';

const FAKE_NOTES = ['6 popular GitHub repositories', 'Extensive open source contributor', 'Favorite language: Python'];

export default class NominationProfile extends Component {
    static propTypes = {
        actions:    PropTypes.object.isRequired,
        auction:    PropTypes.object.isRequired,
        closeView:  PropTypes.func.isRequired,
        nomination: PropTypes.object.isRequired,
    }

    render() {
        const { auction, nomination, unselect } = this.props;

        const contractor = nomination.contractor;
        const skills = new Map(Object.keys(contractor.skill_set.skills).map(skill => [skill, contractor.skill_set.skills[skill]]));
        const githubAccount = !!contractor.remote_work_history ? contractor.remote_work_history.github_accounts[0] : null;

        return (
            <div id='nominationProfile'>
                <CloseIcon onClick={unselect} />
                <ScoredProfilePicture user={nomination.contractor.user} score={nomination.job_fit ? nomination.job_fit.score : null} />
                <RatingStars rating={4.5} />
                <div className='name'>{nomination.contractor.user.name}</div>
                { githubAccount ? <GithubAccountTag account={githubAccount} /> : null }
                <NominationProfileButtons {...this.props} />
                <Notes notes={FAKE_NOTES} />
                <SkillsRadar skills={skills} />
            </div>
        );
    }
};

export class NominationProfileButtons extends Component {
    render() {
        const { auction, nomination, approveNomination, hideNomination, makeNotification } = this.props;
        if (isUnapproved(auction, nomination)) {
            return (
                <div className='actions'>
                    <button onClick={approveNomination.bind(null, auction, nomination)}> {'Approve'} </button>
                    <button data-quiet onClick={hideNomination.bind(null, auction, nomination)}> {'Hide'} </button>
                </div>
            );
        } else if (isWaitingForResponse(auction, nomination)) {
            return (
                <div className='actions'>
                    <button data-warning onClick={makeNotification.bind(null, 'Undo approval not yet implemented!')}> {'Revoke Approval'} </button>
                </div>
            );
        } else if (isRejected(auction, nomination)) {
            return <div className='actions' data-warning>{'Job Rejected'}</div>;
        } else {
            return <div className='actions'>{'Job Accepted'}</div>;
        }

    }
}
