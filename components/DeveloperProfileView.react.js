import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as GithubAccountActions from '../actions/GithubAccountActions';

import DeveloperHeader from './DeveloperHeader.react';
import SkillsRadar from './SkillsRadar.react';
import PastWorkChart from './PastWorkChart.react';
import NothingHere from './NothingHere.react';
import LargePlusIcon from './LargePlusIcon.react';

export default class DeveloperProfileView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        contractor: PropTypes.object.isRequired,
    }

    render() {
        const { user, contractor, actions } = this.props;
        // this is a hack...TODO: Change the reducer to use a map for the skills instead of converting to a
        // map every time we need to use the data.
        if (!contractor) {
            return (
                <NothingHere>
                    <h3>Developer Profile</h3>
                    <h4>If you sign up as a developer, information about your skills will show up here.</h4>
                    <button>Sign Up</button>
                </NothingHere>
            );
        }
        const skills = new Map(Object.keys(contractor.skill_set.skills).map(skill => [skill, contractor.skill_set.skills[skill]]));
        const githubAccount = !!contractor.remote_work_history ? contractor.remote_work_history.github_accounts[0] : null;

        return (
            <div className='contentView' id='developerProfileView'>
                <div className='skillsRadarChart'>
                    <SkillsRadar skills={skills} />
                </div>
                <DeveloperHeader user={user} contractor={contractor} />
                <PastWorkChart reviews={[]} />
            </div>
        );
    }
};

// This is duplicated. Also exists in the import project modal. Not sure what the right way to deal with is. TODO: Revisit
let mapStateToProps = state => ({ githubAccounts: state.githubAccounts });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(GithubAccountActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(DeveloperProfileView);
