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
var ImportableReposList = require('../components/ImportableReposList.react');

var ImportableReposView = React.createClass({
    propTypes: {
        accounts: React.PropTypes.array.isRequired,
    },
    getInitialState: () => _.extend({ projectsToImport: new Set() }, GithubStore.getState()),
    componentWillMount: function() {
        GithubStore.addChangeListener(this._onChange);
    },
    componentDidMount: function() {
        console.log('view mounted');
        handleScrollShadows(this.refs.projectImportWrapper);
        var node = ReactDOM.findDOMNode(this.refs.projectImportWrapper);
        node.addEventViewener('scroll', handleScrollShadows.bind(null, this.refs.projectImportWrapper), false);
    },
    componentDidUpdate: function() {
        handleScrollShadows(this.refs.projectImportWrapper);
    },
    componentWillUnmount: function() {
        console.log('view unmounted');
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
            </div>
        );
    }
});

module.exports = ImportableReposView;
