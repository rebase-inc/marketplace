import React, { Component, PropTypes } from 'react';

import { FindTalent } from './Icons.react';

export default class FindTalentPanel extends Component {
    render() {
        return (
            <td className='findTalentPanel'>
                <FindTalent/>
                <span>Find Talent</span>
            </td>
        );
    }
};
