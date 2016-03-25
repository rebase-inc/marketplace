import React, { Component, PropTypes } from 'react';

import NothingHere from './NothingHere.react';
import ReviewsImage from './ReviewsImage.react';
import { IN_PROGRESS } from '../constants/ViewConstants';
import { selectView }  from '../actions/UserActions';

export default class NoReviewsView extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
    }
    render() {
        const { role } = this.props;
        const nothingHereString = role.type == 'manager' ?
            'Once you\'ve had some work completed, it will show up here.' :
                'Once you\'ve completed some work, it will show up here.';
        return (
            <div className='contentView' id='nothingHere'>
                <ReviewsImage />
                <div id='content'>
                    <h3>{'Your completed work'}</h3>
                    <h4>{ nothingHereString }</h4>
                    <button onClick={selectView.bind(null, IN_PROGRESS)}>{ 'View Current Work' }</button>
                </div>
            </div>
        );
    }
}
