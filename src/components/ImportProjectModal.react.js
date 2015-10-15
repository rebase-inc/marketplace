var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var GithubStore = require('../stores/GithubStore');

var GithubActions = require('../actions/GithubActions');

var ActionConstants = require('../constants/ActionConstants');

var ModalContainer = require('../components/ModalContainer.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');
var Icons = require('../components/Icons.react');




// GithubAccount : {
//     orgs: [
//          { org: { projects: [ { name: 'rebase-inc' code_repository: { repo_id: 'some data' } } ] } }
//     ]
// }
var ImportProjectModal = React.createClass({
    getInitialState: () => _.extend({ projectsToImport: new Set() }, GithubStore.getState()),
    componentWillMount: () => GithubActions.getAccounts(),
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
    toggleProject: function(project) {
        switch (this.state.projectsToImport.has(project)) {
            case true: this.setState((state) => state.projectsToImport.delete(project)); break;
            case false: this.setState((state) => state.projectsToImport.add(project)); break;
        }
    },
    _makeProjectElement: function(repo) {
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
    },
    importSelectedProjects: function() {
        GithubActions.importRepos(this.state.projectsToImport);
        this.props.toggleModal();
    },
    render: function() {
        if (this.state.loading) {
            return (
                <ModalContainer toggleModal={this.props.toggleModal}>
                    <h3>Select Project(s) to Import</h3>
                    <LoadingAnimation/>
                </ModalContainer>
                );
        } else if (!this.state.allAccounts.length) {
            return (
                <ModalContainer toggleModal={this.props.toggleModal}>
                    <h3>You must authorize a Github account first!</h3>
                </ModalContainer>
            );
        } else {
            return (
                <ModalContainer toggleModal={this.props.toggleModal}>
                    <h3>Select Project(s) to Import</h3>
                    <div id='projectImportWrapper' ref='projectImportWrapper'>
                        <table>
                            <tbody>
                                { this.state.allRepos.filter(r => !this.props.importedProjects.has(r.name)).map(this._makeProjectElement) }
                            </tbody>
                        </table>
                    </div>
                    <button onClick={this.importSelectedProjects}>Import Selected</button>
                </ModalContainer>
            );
        }
    }
});

module.exports = ImportProjectModal;
