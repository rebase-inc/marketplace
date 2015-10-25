import React, { Component, PropTypes } from 'react';
import { Comment } from './Icons.react';

export default class CommentsPanel extends Component {
    render() {
       const { comments } = this.props;
       return (
            <td className='commentsPanel'>
                <Comment />
                <span>{comments.length} Comments</span>
            </td>
       );
    }
}
