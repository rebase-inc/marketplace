import React, { Component, PropTypes } from 'react';

export default class SkillsRequiredPanel extends Component {
    render() {
        const { skills } = this.props;
        return (
            <td className='skillsRequiredPanel'>
                <div className='skills'>
                    { Object.keys(skills).map(s => <div key={s} className='skill'>{s}</div>) }
                </div>
            </td>
        );
    }
}
