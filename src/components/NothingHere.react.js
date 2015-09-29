var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var UserActions = require('../actions/UserActions');

var ViewTypes = require('../constants/ViewConstants').ViewTypes;

var NothingHere = React.createClass({
    getInitialState: () => ({mounted: false}),
    componentDidMount: function() {
        setTimeout(function() {
            !!this.isMounted() ?  this.setState({ mounted: true }) : null;
        }.bind(this), 50); // animation hack
    },
    render: function() {
        return (
            <div id='nothingHere'>
                <div id='opacityMask' className={!!this.state.mounted ? 'fade-away' : ''} />
                <div id='content'>
                    <h3>In order to get some work done, you first need some tasks</h3>
                    <button onClick={UserActions.selectView.bind(null, ViewTypes.PROJECTS)}>Import GitHub Project</button>
                    <span>OR</span>
                    <button className='notification'>Add a Sample Task</button>
                </div>
           </div>
        );
    }
});

module.exports = NothingHere;
