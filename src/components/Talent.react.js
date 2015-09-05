var React = require('react');

var Talent = React.createClass({
    //propTypes: {
        //currentRole: React.PropTypes.object.isRequired,
        //auction: React.PropTypes.object.isRequired,
        //selectAuction: React.PropTypes.func.isRequired,
    //},
    getInitialState: function() {
        return { talentState: 'unapproved' };
    },
    approve: function() {
        this.setState({ talentState: 'rejected' });
    },
    render: function() {
        return (
            <tr className='nomination'>
                <td className='actionPanel'>
                    <Icons.ApproveTalent state={this.state.talentState} approve={this.approve}/>
                </td>
                <td className='talentPanel'>
                    <span>Andrew Millspaugh</span>
                    <RatingStars rating={3} />
                </td>
                <td className='reasonSelectedPanel'>
                    Blah blah blah blah blah blah blah blah blah blah blah
                    Blah blah blah blah blah blah blah blah blah blah blah
                    Blah blah blah blah blah blah blah blah blah blah blah
                    Blah blah blah blah blah blah blah blah blah blah blah
                </td>
                <td className='scorePanel'>
                    <Icons.TalentScore score={0.95} />
                </td>
            </tr>
        );
    }
});

module.exports = Talent;
