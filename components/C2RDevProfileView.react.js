import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';

import DeveloperHeader from './DeveloperHeader.react';
import AchievementRibbons from './AchievementRibbons.react';

export default class C2RDevProfileView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        contractor: PropTypes.object.isRequired,
    }

    render() {
        const { user, contractor, loading } = this.props;
        if (loading) { return <div>Loading...</div> }
        const skills = contractor.skill_set.skills;
        const githubAccount = !!contractor.remote_work_history ? contractor.remote_work_history.github_accounts[0] : null;

        return (
            <div className='contentView' id='developerProfileView'>
                <button onClick={() => window.location.replace('/api/v1/github')}>{ 'Add Github Account' }</button>
                <DeveloperHeader user={user} contractor={contractor} />
                <div className='skillsRadarChart'>
                    <AchievementRibbons skills={skills} />
                </div>
            </div>
        );
    }
};

let mapStateToProps = state => ({
    githubAccounts: state.githubAccounts,
    loading: state.githubAccounts.isFetching
});
export default connect(mapStateToProps)(C2RDevProfileView);
