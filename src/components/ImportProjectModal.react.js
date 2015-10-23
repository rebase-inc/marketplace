var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var GithubStore = require('../stores/GithubStore');
var ImportableGithubReposStore = require('../stores/ImportableGithubReposStore');

var GithubActions = require('../actions/GithubActions');

var ActionConstants = require('../constants/ActionConstants');

var ModalContainer = require('../components/ModalContainer.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');
var Icons = require('../components/Icons.react');

var ImportProjectModal = React.createClass({
    getInitialState: () => GithubStore.getState(),
    componentWillMount: function() {
        GithubStore.addChangeListener(this._onChange);
        GithubActions.getAccounts();
    },
    componentWillUnmount: function() {
        GithubStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(GithubStore.getState());
    },
    addGithubAccount: function() {
        window.location.assign('/github', '_blank')
    },
    render: function() {
        if (this.state.loading) {
            return (
                <ModalContainer toggleModal={this.props.toggleModal}>
                    <h3>Select Project(s) to Import</h3>
                    <LoadingAnimation />
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
                    <ImportableReposView accounts={this.state.allAccounts} toggleModal={this.props.toggleModal}/>
                </ModalContainer>
            );
        }
    }
});

var ImportableReposView = React.createClass({
    propTypes: {
        accounts: React.PropTypes.array.isRequired,
    },
    getInitialState: () => _.extend({ projectsToImport: new Set() }, GithubStore.getState()),
    componentWillMount: function() {
        GithubStore.addChangeListener(this._onChange);
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
        this.setState(GithubStore.getState());
    },
    toggleProject: function(project) {
        switch (this.state.projectsToImport.has(project)) {
            case true: this.setState((state) => state.projectsToImport.delete(project)); break;
            case false: this.setState((state) => state.projectsToImport.add(project)); break;
        }
    },
    importSelectedProjects: function() {
        GithubActions.importRepos(this.state.projectsToImport);
        this.props.toggleModal();
    },
    render: function() {
        let _toggle = this.toggleProject;
        let _projectsToImport = this.state.projectsToImport;
        let ManyListsOfRepos = this.props.accounts.map(function(account) {
            return (
                <ImportableReposList
                    account_id={account.id}
                    key={account.id}
                    toggleProject={_toggle}
                    projectsToImport={_projectsToImport}
                />
            );
        });
        return (
            <div id='importableReposView' ref='projectImportWrapper'>
                <table>
                    {ManyListsOfRepos}
                </table>
                <button onClick={this.importSelectedProjects}>Import Selected</button>
            </div>
        );
    }
});

var ImportableReposList = React.createClass({
    propTypes: {
        account_id:         React.PropTypes.number.isRequired,
        projectsToImport:   React.PropTypes.object.isRequired,
        toggleProject:      React.PropTypes.func.isRequired,
    },
    getInitialState: () => ImportableGithubReposStore.getState(),
    componentDidMount: function() {
        setTimeout(() => GithubActions.getImportableRepos(this.props.account_id), 0);
    },
    componentWillMount: function() {
        ImportableGithubReposStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        ImportableGithubReposStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(ImportableGithubReposStore.getState());
    },
    _makeProjectElement: function(repo) {
        return (
            <tr className='githubProject' key={repo.id}>
                <td className='checkbox'>
                    <Icons.Checkbox checked={this.props.projectsToImport.has(repo)} toggle={this.props.toggleProject.bind(null, repo)} />
                </td>
                <td className='project'>
                    <span>{repo.name}</span>
                </td>
                <td className='organization'>
                    <span>{repo.owner.login}</span>
                </td>
            </tr>
        );
    },
    render: function() {
        let body;
        if (this.state.loading) {
            body = <LoadingAnimation />;
        } else {
            if(this.state.allImportableRepos.has(this.props.account_id)) {
                body = this.state.allImportableRepos.get(this.props.account_id).map(this._makeProjectElement);
            }
        }
        return (
            <tbody key={this.props.account_id}>
                {body}
            </tbody>
        );
    }
});

module.exports = ImportProjectModal;
