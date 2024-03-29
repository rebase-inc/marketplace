import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RebaseIcon from './RebaseIcon.react';
import CheckboxList from './CheckboxList.react';
import { ProjectListView, Project } from './Project.react';

import * as GithubAccountActions from '../actions/GithubAccountActions';

export default class ProjectSelectionView extends Component {
    constructor(props) {
        super(props);
        this.state = { importingProject: false };
        this.toggleImport = () => this.setState(s => ({ importingProject: !s.importingProject }));
    }

    componentDidMount() {
        // this is a horrible hack until we get the api fixed
        this.props.actions.getGithubAccounts();
    }

    render() {
        const { roles, select, user, githubAccounts, actions } = this.props;
        const { importingProject } = this.state;
        console.log
        return (
            <div id='projectSelectionView'>
                <div className='logo'>
                    <RebaseIcon />
                    {'REBASE'}
                </div>
                { importingProject ? <NewProjectView githubAccounts={githubAccounts} getImportableRepos={actions.getImportableRepos} importGithubRepos={actions.importGithubRepos} /> :
                    <ProjectListView toggleImport={this.toggleImport} roles={roles.filter(r => r.type == 'manager')} select={select} /> }
            </div>
        );
    }
}

export class NewProjectView extends Component {

    componentDidMount() {
        // this is a horrible hack until we get the api fixed
        this.props.githubAccounts.forEach(a => !a.repos ? this.props.getImportableRepos(a) : null);
    }

    render() {
        const { githubAccounts, getGithubProjects, importGithubRepos } = this.props;
        const projects = githubAccounts.reduce((prev, curr) => prev.concat(curr.repos || []), []);
        return (
            <div className='content'>
                <div className='title'>{ projects.length ? 'Select a Project' : 'Add New GitHub Account'}</div>
                { projects.length ? <CheckboxList items={projects.map(p => Object.assign(p, {login: p.owner.login}))} fieldsToDisplay={['name','login']} onSubmit={importGithubRepos} buttonText={'Import Selected'} /> : null }
                { projects.length ? <div>{'Add a New GitHub Account'}</div> : null }
                { projects.length ? null : <button onClick={() => window.location.replace('/api/v1/github')}>Authorize GitHub</button> }
            </div>
        );
    }
}

// Not entirely sure this belongs in its own scope of the state and actions, but we'll leave it for now...TODO: revisit
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(GithubAccountActions, dispatch)});
export default connect(() => ({}), mapDispatchToProps)(ProjectSelectionView);
