var React = require('react');

var NothingHere = React.createClass({
    render: function() {
        return (
            <div id='nothingHere'>
                <div>
                    <h3>In order to get some work done, you first need some tasks</h3>
                    <button>Import GitHub Project</button>
                    <span>OR</span>
                    <button className='notification'>Add a Sample Task</button>
                </div>
           </div>
        );
    }
});

module.exports = NothingHere;
