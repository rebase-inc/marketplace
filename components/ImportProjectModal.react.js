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

var ImportProjectModal = React.createClass({
    propTypes: {
        importedProjects: React.PropTypes.object.isRequired,
    },
    getInitialState: () => _.extend({ projectsToImport: new Set() }, GithubStore.getState()),
    componentWillMount: function() {
        GithubStore.addChangeListener(this._onChange);
        GithubActions.getAccounts();
    },
    componentDidMount: function() {
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
        console.log('calling on change');
        this.setState(GithubStore.getState());
    },
    toggleProject: function(project) {
        switch (this.state.projectsToImport.has(project)) {
            case true: this.setState((state) => state.projectsToImport.delete(project)); break;
            case false: this.setState((state) => state.projectsToImport.add(project)); break;
        }
    },
    _makeProjectElement: function(repo) {
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
    },
    importSelectedProjects: function() {
        GithubActions.importRepos(this.state.projectsToImport);
        this.props.toggleModal();
    },
    addGithubAccount: function() {
        window.location.assign('/github', '_blank')
    },
    render: function() {
        console.log('rendering with loading: ', this.state.loading);
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
});

module.exports = ImportProjectModal;
