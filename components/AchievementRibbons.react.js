import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Ribbon from './Ribbon.react';


export default class AchievementRibbons extends Component {
    static propTypes = {
        skills: PropTypes.array.isRequired,
    }

    render() {
        let { skills } = this.props;
        return (
            <div className='achievement-ribbons'>
                {
                    skills.map( entry => <Ribbon tech={entry[0]} ranking={entry[1]} /> )
                }
            </div>
        );
    }
};
