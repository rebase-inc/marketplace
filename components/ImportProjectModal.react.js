import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ModalContainer from './ModalContainer.react';
import LoadingAnimation from './LoadingAnimation.react';

import { Checkbox } from './Icons.react';

import * as GithubAccountActions from '../actions/GithubAccountActions';

export default class ImportProjectModal extends Component {
    static propTypes =  {
        projects: PropTypes.object.isRequired,
        githubAccounts: PropTypes.object.isRequired,
    }

    componentDidMount() {
        this.props.actions.getGithubAccounts();
    }

    constructor(props, context) {
        super(props, context);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    toggleProject(project) {
        switch (this.state.projectsToImport.has(project)) {
            case true: this.setState((state) => state.projectsToImport.delete(project)); break;
            case false: this.setState((state) => state.projectsToImport.add(project)); break;
        }
    }

    _makeProjectElement(repo) {
        if (repo.project.imported) {
            return null;
        }
        let managerRoles = this.props.currentUser.roles.filter(role => role.type == 'manager');
        if (managerRoles.filter(role => role.project.name == repo.name && repo.project.organization.name).length) {
            return null;
        }
        return (
            <tr className='githubProject' key={repo.repo_id}>
                <td className='checkbox'>
                    <Icons.Checkbox checked={this.state.projectsToImport.has(repo)} toggle={this.toggleProject.bind(null, repo)} />
                </td>
                <td className='project'>
                    <span>{repo.name}</span>
                </td>
                <td className='organization'>
                    <span>{repo.project.organization.login}</span>
                </td>
            </tr>
        );
    }

    render() {
        const { githubAccounts, projects, close } = this.props;
        if (!githubAccounts.items.size) {
            return (
                <ModalContainer close={close}>
                    <h3>You must authorize a Github account first!</h3>
                    <button onClick={() => window.location.assign('localhost:5000/github', '_blank')}>Add Github Account</button>
                </ModalContainer>
            );
        }

        return (
            <ModalContainer close={close}>
                <h3>Select Project(s) to Import</h3>
                <div id='projectImportWrapper' ref='projectImportWrapper'>
                    { githubAccounts.isFetching ? <LoadingAnimation /> :
                        <table>
                            <tbody>
                            { this.state.allRepos.map(this._makeProjectElement) }
                            </tbody>
                        </table>
                    }
                </div>
                <button onClick={this.importSelectedProjects}>Import Selected</button>
            </ModalContainer>
        );
    }
};

// Not entirely sure this belongs in its own scope of the state and actions, but we'll leave it for now...TODO: revisit
let mapStateToProps = state => ({ githubAccounts: state.githubAccounts });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(GithubAccountActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ImportProjectModal);
