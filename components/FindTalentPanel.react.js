var React = require('react');

var Icons = require('../components/Icons.react');

var FindTalentPanel = React.createClass({
    render: function() {
        return (
            <td onClick={this.props.onClick} className='findTalentPanel'>
                <Icons.FindTalent/>
                <span>Find Talent</span>
            </td>
        );
    }
});

module.exports = FindTalentPanel;
