import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';

import DeveloperHeader from './DeveloperHeader.react';
import SkillsRadar from './SkillsRadar.react';
import PastWorkChart from './PastWorkChart.react';

export default class C2RDevProfileView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        contractor: PropTypes.object.isRequired,
    }

    render() {
        const { user, contractor } = this.props;
        const skills = new Map(Object.keys(contractor.skill_set.skills).map(skill => [skill, contractor.skill_set.skills[skill]]));
        const githubAccount = !!contractor.remote_work_history ? contractor.remote_work_history.github_accounts[0] : null;

        return (
            <div className='contentView' id='developerProfileView'>
                <button onClick={() => window.location.replace('/api/v1/github')}>{ 'Add Github Account' }</button>
                <div className='skillsRadarChart'>
                    <SkillsRadar skills={skills} />
                </div>
                <DeveloperHeader user={user} contractor={contractor} />
                <PastWorkChart reviews={[]} />
            </div>
        );
    }
};

let mapStateToProps = state => ({ githubAccounts: state.githubAccounts });
export default connect(mapStateToProps)(C2RDevProfileView);
