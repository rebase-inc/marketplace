var React = require('react');
var ReactDOM = require('react-dom');

var ModalContainer = require('../components/ModalContainer.react');

var GithubActions = require('../actions/GithubActions');

var GithubStore = require('../stores/GithubStore');

var viewConstants = require('../constants/viewConstants');

var ImportProjectModal = React.createClass({
    getInitialState: function() {
        return GithubStore.getState();
    },
    componentWillMount: function() {
        GithubActions.getRepoData();
    },
    componentDidMount: function() {
        GithubStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        GithubStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(GithubStore.getState());
    },
    _makeProject: function(repo) {
        return (
            <div id='githubProject'>
                <input type='checkbox'/>
                <span>{repo.name}</span>
                <span>{repo.owner.login}</span>
            </div>
        );
    },
    render: function() {
        return (
            <ModalContainer>
                <div onClick={this.props.toggleModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>Select Project(s) to Import</h3>
                { this.state.allRepos.map(this._makeProject) }
            </ModalContainer>
        );
    }
});

module.exports = ImportProjectModal;
