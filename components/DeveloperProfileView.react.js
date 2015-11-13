import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as GithubAccountActions from '../actions/GithubAccountActions';

import RatingStars from './RatingStars.react';
import SkillsRadar from './SkillsRadar.react';
import PastWorkChart from './PastWorkChart.react';
import GithubAccountTag from './GithubAccountTag.react';
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
                    <h3>You haven't registered as a developer</h3>
                    <button>Register Now</button>
                </NothingHere>
            );
        }
        const skills = new Map(Object.keys(contractor.skill_set.skills).map(skill => [skill, contractor.skill_set.skills[skill]]));
        //const githubAccount = !!contractor.remote_work_history ? user.github_accounts[0] : null;

        const githubAccount = null;
        return (
            <div className='contentView' id='developerProfileView'>
                <h1>{user.first_name + ' ' + user.last_name}</h1>
                <RatingStars colored={false} rating={4.5} />
                <h5>{'Rating based on ' + 67 + ' tasks'}</h5>
                <GithubAccountTag account={githubAccount} authorize={() => window.location.replace('/api/v1/github')} />
                <SkillsRadar skills={skills} />
                <h5>Completed Work</h5>
                <PastWorkChart />
            </div>
        );
    }
};

// This is duplicated. Also exists in the import project modal. Not sure what the right way to deal with is. TODO: Revisit
let mapStateToProps = state => ({ githubAccounts: state.githubAccounts });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(GithubAccountActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(DeveloperProfileView);
