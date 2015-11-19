import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import ProfilePicture from './ProfilePicture.react';
import {humanReadableDate} from '../utils/date.js';

export default class Comment extends Component {
    static propTypes = {
       comment: PropTypes.object.isRequired,
    }
    render() {
        const { comment } = this.props;
        return (
            <div className='comment' key={comment.id}>
                <div className='photo'>
                    <ProfilePicture user={comment.user}/>
                </div>
                <div className='content'>
                    <div className='name'>{comment.user.first_name + ' ' + comment.user.last_name}</div>
                    <div className='date'>{humanReadableDate(comment.created)}</div>
                    <div className='text'>{comment.content}</div>
                </div>
            </div>
        );
    }
}
