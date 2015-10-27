import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { ProfilePicture } from './Icons.react';

const MonthNames = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default class Comment extends Component {
    static propTypes = {
       comment: PropTypes.object.isRequired,
    }
    render() {
        const { comment } = this.props;
        let dateString = (date) => { return MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(comment.date));
        return (
            <div className='comment' key={comment.id}>
                <div className='photo'>
                    <ProfilePicture user={comment.user}/>
                </div>
                <div className='content'>
                    <div className='name'>{comment.user.first_name + ' ' + comment.user.last_name}</div>
                    <div className='date'>{dateString}</div>
                    <div className='text'>{comment.content}</div>
                </div>
            </div>
        );
    }
}
