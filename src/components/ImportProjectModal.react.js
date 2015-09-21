var React = require('react');
var ReactDOM = require('react-dom');

var ModalContainer = require('../components/ModalContainer.react');

var GithubActions = require('../actions/GithubActions');

var GithubStore = require('../stores/GithubStore');

var viewConstants = require('../constants/viewConstants');
var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var ImportProjectModal = React.createClass({
    getInitialState: function() {
        return GithubStore.getState();
    },
    componentWillMount: function() {
        GithubActions.getRepoData();
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
    _makeProject: function(repo, ind) {
        return (
            <tr className='githubProject'>
                <td className='checkbox'>
                    <input type='checkbox' id={'checkbox' + ind} />
                    <label htmlFor={'checkbox' + ind} />
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
        return (
            <ModalContainer>
                <div onClick={this.props.toggleModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>Select Project(s) to Import</h3>
                <div id='projectImportWrapper' ref='projectImportWrapper'>
                    <table>
                        <tbody>
                            { this.state.allRepos.map(this._makeProject) }
                        </tbody>
                    </table>
                </div>
                <button onClick={alert.bind(null, 'Im not implemented yet motherfucker')}>Import Selected</button>
            </ModalContainer>
        );
    }
});

module.exports = ImportProjectModal;
