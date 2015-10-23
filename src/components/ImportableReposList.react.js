var React = require('react');

var ImportableGithubReposStore = require('../stores/ImportableGithubReposStore');

var GithubActions = require('../actions/GithubActions');

var ActionConstants = require('../constants/ActionConstants');

var ModalContainer = require('../components/ModalContainer.react');
var LoadingAnimation = require('../components/LoadingAnimation.react');
var Icons = require('../components/Icons.react');

var ImportableReposView = React.createClass({
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

module.exports = ImportableReposView;
