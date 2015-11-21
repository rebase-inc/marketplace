import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import ProfilePicture from './ProfilePicture.react';
import {humanReadableDate} from '../utils/date.js';

import marked from 'marked';
import highlight from 'highlight.js';
import 'highlight.js/styles/solarized_dark.css';

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    highlight: code => highlight.highlightAuto(code).value,
});

export default class Comment extends Component {
    static propTypes = {
       comment: PropTypes.object.isRequired,
    }
    rawMarkup() {
        var rawMarkup = marked(this.props.comment.content, {sanitize: true});
        return { __html: rawMarkup };
    }
    render() {
        const { comment } = this.props;
        return (
            <div className='comment' key={comment.id}>
                <div className='photo'>
                    <ProfilePicture user={comment.user}/>
                </div>
                <div className='content'>
                    <div className='name'>{comment.user.name}</div>
                    <div className='date'>{humanReadableDate(comment.created)}</div>
                    <div className='text' dangerouslySetInnerHTML={this.rawMarkup()}/>
                </div>
            </div>
        );
    }
}
