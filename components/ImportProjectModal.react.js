import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';
import LoadingAnimation from './LoadingAnimation.react';

import { Checkbox } from './Icons.react';

export default ImportProjectModal extends Component {
    static propTypes =  {
        importedProjects: PropTypes.object.isRequired,
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
    importSelectedProjects() {
        GithubActions.importRepos(this.state.projectsToImport);
        this.props.toggleModal();
    }
    addGithubAccount() {
        window.location.assign('/github', '_blank')
    }
    render() {
        if (this.state.loading) {
            return (
                <ModalContainer toggleModal={this.props.toggleModal}>
                    <h3>Select Project(s) to Import</h3>
                    <div id='projectImportWrapper' ref='projectImportWrapper'>
                        <LoadingAnimation />
                    </div>
                    <button onClick={this.importSelectedProjects}>Import Selected</button>
                </ModalContainer>
                );
        } else if (!this.state.allAccounts.length) {
            return (
                <ModalContainer toggleModal={this.props.toggleModal}>
                    <h3>You must authorize a Github account first!</h3>
                    <button onClick={this.addGithubAccount}>Add Github Account</button>
                </ModalContainer>
            );
        } else {
            return (
                <ModalContainer toggleModal={this.props.toggleModal}>
                    <h3>Select Project(s) to Import</h3>
                    <div id='projectImportWrapper' ref='projectImportWrapper'>
                        <table>
                            <tbody>
                            { this.state.allRepos.map(this._makeProjectElement) }
                            </tbody>
                        </table>
                    </div>
                    <button onClick={this.importSelectedProjects}>Import Selected</button>
                </ModalContainer>
            );
        }
    }
};
