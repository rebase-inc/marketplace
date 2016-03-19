import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuctionActions from '../actions/AuctionActions';

import Actions from './DevPubProfileActions.react.js';
import DeveloperPublicProfileHeader from './DeveloperPublicProfileHeader.react';
import Notes from './Notes.react';
import NothingHere from './NothingHere.react';
import ProfilePicture from './ProfilePicture.react';
import SkillsRadar from './SkillsRadar.react';

export default class DeveloperPublicProfileView extends Component {
    static propTypes = {
        actions:    PropTypes.object.isRequired,
        approve:    PropTypes.func.isRequired,
        closeView:  PropTypes.func.isRequired,
        hide:       PropTypes.func.isRequired,
        nomination: PropTypes.object.isRequired,
    }

    render() {
        const { actions, approve, closeView, hide, nomination } = this.props;
        // this is a hack...TODO: Change the reducer to use a map for the skills instead of converting to a
        // map every time we need to use the data.
        if (!nomination) {
            return (
                <NothingHere>
                    <h3>Developer Profile</h3>
                    <h4>If you sign up as a developer, information about your skills will show up here.</h4>
                    <button>Sign Up</button>
                </NothingHere>
            );
        }
        const contractor = nomination.contractor;
        const skills = new Map(Object.keys(contractor.skill_set.skills).map(skill => [skill, contractor.skill_set.skills[skill]]));
        const notes = ['6 popular GitHub repositories', 'Extensive open source contributor', 'Favorite language: Python'];
        const githubAccount = !!contractor.remote_work_history ? contractor.remote_work_history.github_accounts[0] : null;

        return (
            <div className='contentList' id='developerPublicProfileView' onClick={closeView} >
                <div className='photo'>
                    <ProfilePicture user={contractor.user}/>
                </div>
                <DeveloperPublicProfileHeader user={contractor.user} contractor={contractor} />
                <Actions approve={approve} hide={hide} nomination={nomination}/>
                <Notes notes={notes} />
                <div className='skillsRadarChart'>
                    <SkillsRadar skills={skills} />
                </div>
            </div>
        );
    }
};

// This is duplicated. Also exists in the import project modal. Not sure what the right way to deal with is. TODO: Revisit
let mapStateToProps = state => ({ githubAccounts: state.githubAccounts });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(AuctionActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(DeveloperPublicProfileView);
