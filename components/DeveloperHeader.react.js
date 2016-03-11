import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import RatingStars from './RatingStars.react';
import GithubAccountTag from './GithubAccountTag.react';

export default class DeveloperHeader extends Component {
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
        const githubAccount = !!contractor.remote_work_history ? contractor.remote_work_history.github_accounts[0] : null;

        return (
            <div id='developerHeader'>
                <h1>{user.name}</h1>
                <RatingStars colored={false} rating={4.5} />
                <h5>{'Rating based on ' + 67 + ' tasks'}</h5>
                { !!githubAccount ? <GithubAccountTag account={githubAccount} authorize={() => window.location.replace('/api/v1/github')} /> : null }
            </div>
        );
    }
}
