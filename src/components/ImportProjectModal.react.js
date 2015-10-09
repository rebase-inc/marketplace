var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

var LoadingAnimation = require('../components/LoadingAnimation.react');

var ActionConstants = require('../constants/ActionConstants');

var ModalContainer = require('../components/ModalContainer.react');

var GithubActions = require('../actions/GithubActions');

var GithubStore = require('../stores/GithubStore');

var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var ImportProjectModal = React.createClass({
    getInitialState: function() {
        return {
            projectsToImport:   {},
            importableRepos:    [],
            loading:            true
        };
    },
    _computeImportableRepos: function(githubRepos, importedProjects) {
        // importablesRepos = githubRepos - importedProjects
        var _imported = new Map();
        importedProjects.forEach(project => _imported.set(project.name, project));
        return githubRepos.reduce(function (importable, repo) {
            if (_imported.has(repo.name)) {
                return importable;
            }
            importable.push(repo);
            return importable;
        }, []);
    },
    componentWillMount: function() {
        GithubActions.getAccounts();
    },
    componentDidMount: function() {
        GithubStore.addChangeListener(this._onGithubChange);
        handleScrollShadows(this.refs.projectImportWrapper);
        var node = ReactDOM.findDOMNode(this.refs.projectImportWrapper);
        node.addEventListener('scroll', handleScrollShadows.bind(null, this.refs.projectImportWrapper), false);
    },
    componentDidUpdate: function() {
        handleScrollShadows(this.refs.projectImportWrapper);
    },
    componentWillUnmount: function() {
        GithubStore.removeChangeListener(this._onGithubChange);
    },
    _onGithubChange: function(action_type) {
        var ghState = GithubStore.getState();
        var _repos = this._computeImportableRepos(
            ghState.allAccounts.reduce(this._intoRepos, []),
            this.props.importedProjects
        );
        this.setState(_.extend(this.state, {
            importableRepos: _repos,
            loading: ghState.loading
        }));
        if (action_type == ActionConstants.IMPORT_GITHUB_REPOS) {
            this.props.toggleModal();
        }
    },
    _selectRepo: function(repo, state) {
        var projects = state.projectsToImport;
        projects[repo.repo_id] = repo;
        return { projectsToImport: projects };
    },
    _unselectRepo: function(repo, state) {
        var projects = state.projectsToImport;
        delete projects[repo.repo_id];
        return { projectsToImport: projects };
    },
    addProject: function(repo, event) {
        if (!!event.target.checked) {
            this.setState(this._selectRepo.bind(null, repo));
        } else {
            this.setState(this._unselectRepo.bind(null, repo));
        }
    },
    _makeProject: function(repo, ind) {
        return (
            <tr className='githubProject' key={ind}>
                <td className='checkbox'>
                    <input onChange={this.addProject.bind(null, repo)} type='checkbox' id={'checkbox' + ind} />
                    <label htmlFor={'checkbox' + ind} />
                </td>
                <td className='project'>
                    <span>{repo.name}</span>
                </td>
                <td className='organization'>
                    <span>{repo.org.login}</span>
                </td>
            </tr>
        );
    },
    _intoRepos: function(Repos, account, _, __) {
        // reduces an array of GithubAccounts into an array of GithubRepositories
        return Repos.concat(
            account.orgs.reduce(function(result, org, _, __) { return result.concat(org.repos); }, [])
        );
    },
    _importRepos: function() {
        GithubActions.importRepos(this.state.projectsToImport);
        this.props.toggleModal();
    },
    render: function() {
        if (this.state.loading) {
        return (
            <ModalContainer>
                <div onClick={this.props.toggleModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>Select Project(s) to Import</h3>
                <LoadingAnimation/>
            </ModalContainer>
        );
        } else {
        return (
            <ModalContainer>
                <div onClick={this.props.toggleModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>Select Project(s) to Import</h3>
                <div id='projectImportWrapper' ref='projectImportWrapper'>
                    <table>
                        <tbody>
                            { this.state.importableRepos.map(this._makeProject) }
                        </tbody>
                    </table>
                </div>
                <button onClick={this._importRepos}>Import Selected</button>
            </ModalContainer>
        );
        }
    }
});

module.exports = ImportProjectModal;
