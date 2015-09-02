var React = require('react');

var Icons = require('../components/RebaseIcons.react');

var FindTalentPanel = React.createClass({
    render: function() {
        return (
            <td onClick={this.props.handleClick} className='findTalentPanel'>
                <Icons.FindTalent/>
                <span>Find Talent</span>
            </td>
        );
    }
});

module.exports = FindTalentPanel;
