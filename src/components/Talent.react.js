var React = require('react');

var Icons = require('../components/Icons.react');
var RatingStars = require('../components/RatingStars.react');

var Talent = React.createClass({
    propTypes: {
        nomination: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return { talentState: 'unapproved' };
    },
    render: function() {
        return (
            <tr className='nomination'>
                <td className='actionPanel'>
                    <Icons.ApproveTalent nomination={this.props.nomination} />
                </td>
                <td className='talentPanel'>
                    <span>{this.props.nomination.contractor.user.first_name + ' ' + this.props.nomination.contractor.user.last_name}</span>
                    <RatingStars rating={this.props.nomination.contractor.rating} />
                </td>
                <td className='reasonSelectedPanel'> No information yet </td>
                <td className='scorePanel'>
                    <Icons.TalentScore score={this.props.nomination.job_fit.score/100} />
                </td>
            </tr>
        );
    }
});

module.exports = Talent;
