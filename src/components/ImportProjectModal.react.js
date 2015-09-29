var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

var ModalContainer = require('../components/ModalContainer.react');

var GithubActions = require('../actions/GithubActions');

var GithubStore = require('../stores/GithubStore');

var viewConstants = require('../constants/viewConstants');
var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var ImportProjectModal = React.createClass({
    getInitialState: function() {
        return _.extend({projectsToImport: {}}, GithubStore.getState());
    },
    componentWillMount: function() {
        GithubActions.getAccounts();
    },
    componentDidMount: function() {
        GithubStore.addChangeListener(this._onChange);
        handleScrollShadows(this.refs.projectImportWrapper);
        var node = ReactDOM.findDOMNode(this.refs.projectImportWrapper);
        node.addEventListener('scroll', handleScrollShadows.bind(null, this.refs.projectImportWrapper), false);
    },
    componentDidUpdate: function() {
        handleScrollShadows(this.refs.projectImportWrapper);
    },
    componentWillUnmount: function() {
        GithubStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(GithubStore.getState());
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
            <tr className='githubProject'>
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
    },
    render: function() {
        return (
            <ModalContainer>
                <div onClick={this.props.toggleModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>Select Project(s) to Import</h3>
                <div id='projectImportWrapper' ref='projectImportWrapper'>
                    <table>
                        <tbody>
                            { this.state.allAccounts.reduce(this._intoRepos, []).map(this._makeProject) }
                        </tbody>
                    </table>
                </div>
                <button onClick={this._importRepos}>Import Selected</button>
            </ModalContainer>
        );
    }
});

module.exports = ImportProjectModal;
