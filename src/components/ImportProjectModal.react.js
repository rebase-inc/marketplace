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
        return _.extend({projectsToImport: new Set()}, GithubStore.getState());
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
    addProject: function(repoId, event) {
        if (!!event.target.checked) {
            this.setState((state) => {projectsToImport: state.projectsToImport.add(repoId)});
        } else {
            this.setState((state) => {projectsToImport: state.projectsToImport.delete(repoId)});
        }
    },
    _makeProject: function(repo, ind) {
        return (
            <tr className='githubProject'>
                <td className='checkbox'>
                    <input onChange={this.addProject.bind(null, repo.id)} type='checkbox' id={'checkbox' + ind} />
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
                <button onClick={() => {alert.bind(null, 'Im not implemented yet motherfucker')(); console.log(this.state.projectsToImport)}}>Import Selected</button>
            </ModalContainer>
        );
    }
});

module.exports = ImportProjectModal;
