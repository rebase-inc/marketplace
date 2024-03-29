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
        close: PropTypes.func.isRequired,
        githubAccounts: PropTypes.object.isRequired,
    }

    componentDidMount() {
        this.props.actions.getGithubAccounts();
    }

    constructor(props, context) {
        super(props, context);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.toggleProject = this.toggleProject.bind(this);
        this.state = { markedForClose: false };
    }

    componentDidUpdate() {
        if (this.state.markedForClose && !this.props.githubAccounts.isLoading) {
            this.props.close();
        }
    }

    toggleProject(project) {
        switch (this.state.projectsToImport.has(project)) {
            case true: this.setState((state) => state.projectsToImport.delete(project)); break;
            case false: this.setState((state) => state.projectsToImport.add(project)); break;
        }
    }

    render() {
        const { actions, githubAccounts, projects, close } = this.props;
        if (!githubAccounts.items.size) {
            return (
                <ModalContainer close={close}>
                    <h3>You must authorize a Github account first!</h3>
                    <button onClick={() => window.location.replace('/api/v1/github')}>Add Github Account</button>
                </ModalContainer>
            );
        }

        return (
            <ModalContainer close={close} >
                <h3>Select Project(s) to Import</h3>
                { githubAccounts.isFetching ?
                    <LoadingAnimation /> :
                    <ImportableGithubRepos
                        importRepos={(repos) => { this.setState({ markedForClose: true }); actions.importGithubRepos(repos)}}
                        getImportableRepos={actions.getImportableRepos}
                        githubAccounts={Array.from(githubAccounts.items.values())} />
                }
            </ModalContainer>
        );
    }
};

// Switch this out to use CheckboxList Component
export class ImportableGithubRepos extends Component {
    static propTypes = {
        githubAccounts: PropTypes.array.isRequired,
        getImportableRepos: PropTypes.func.isRequired,
        importRepos: PropTypes.func.isRequired,
    }

    componentDidMount() {
        // this is a horrible hack until we get the api fixed
        this.props.githubAccounts.forEach(a => !a.repos ? this.props.getImportableRepos(a) : null);
    }

    render() {
        const { githubAccounts, importRepos } = this.props;
        const { selectedRepos } = this.state;
        const repos = githubAccounts.reduce((prev, curr) => prev.concat(curr.repos || []), []);
        return (
            <div id='importableReposView' ref='projectImportWrapper'>
                <table>
                    { repos.map(r => <ImportableGithubRepo repo={r} key={r.id} selected={selectedRepos.has(r)} toggle={this.toggleRepo.bind(null, r)} />) }
                </table>
                <button onClick={() => importRepos(selectedRepos)}>Import Selected</button>
            </div>
        );
    }
}

export class ImportableGithubRepo extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        repo: PropTypes.object.isRequired,
        toggle: PropTypes.func.isRequired,
    }

    render() {
        const { selected, toggle, repo } = this.props;
        return (
            <tr className='githubProject'>
                <td className='checkbox'>
                    <Checkbox checked={selected} toggle={toggle} />
                </td>
                <td className='project'>
                    <span>{repo.name}</span>
                </td>
                <td className='organization'>
                    <span>{repo.owner.login}</span>
                </td>
            </tr>
        );
    }
}

// Not entirely sure this belongs in its own scope of the state and actions, but we'll leave it for now...TODO: revisit
let mapStateToProps = state => ({ githubAccounts: state.githubAccounts });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(GithubAccountActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ImportProjectModal);
