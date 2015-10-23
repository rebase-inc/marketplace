var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var GithubStore = require('../stores/GithubStore');

var GithubActions = require('../actions/GithubActions');

var ActionConstants = require('../constants/ActionConstants');

var ModalContainer = require('../components/ModalContainer.react');
var ImportableReposView = require('../components/ImportableReposView.react');
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

module.exports = ImportProjectModal;
