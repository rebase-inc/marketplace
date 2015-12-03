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
                    <div className='date'>{comment.created ? humanReadableDate(comment.created) : '(pending)'}</div>
                    { comment.isFetching ? <PendingIcon /> : null }
                    <div className='text' dangerouslySetInnerHTML={this.rawMarkup()}/>
                </div>
                <div className='status'></div>
            </div>
        );
    }
}

export class PendingIcon extends Component {
    render() {
        return (
            <svg viewBox='0 0 32 32' className='rotate'>
                <g transform="translate(0.8, 4.6)" stroke="none" strokeWidth="1" fill="#25AE90">
                    <path d="M4.5146,15.1094 C4.5056,15.1094 4.4966,15.1094 4.4886,15.1084 C4.3316,15.1004 4.1876,15.0184 4.0996,14.8874 L0.5846,9.6534 C0.4316,9.4244 0.4926,9.1144 0.7216,8.9604 C0.9506,8.8044 1.2606,8.8664 1.4146,9.0964 L4.5576,13.7774 L8.1716,9.4504 C8.3486,9.2394 8.6626,9.2094 8.8756,9.3864 C9.0876,9.5634 9.1156,9.8794 8.9386,10.0904 L4.8986,14.9294 C4.8036,15.0444 4.6626,15.1094 4.5146,15.1094"></path>
                    <path d="M29.4624,15.2988 C29.3014,15.2988 29.1434,15.2218 29.0464,15.0768 L25.9054,10.3968 L22.2904,14.7248 C22.1124,14.9368 21.7974,14.9658 21.5854,14.7878 C21.3734,14.6118 21.3454,14.2958 21.5224,14.0838 L25.5654,9.2438 C25.6664,9.1228 25.8184,9.0378 25.9754,9.0658 C26.1324,9.0728 26.2764,9.1548 26.3644,9.2858 L29.8774,14.5208 C30.0304,14.7488 29.9694,15.0608 29.7404,15.2138 C29.6544,15.2718 29.5584,15.2988 29.4624,15.2988"></path>
                    <path d="M15.2026,22.6709 C12.2936,22.6709 9.4806,21.5359 7.3456,19.4309 C7.1486,19.2359 7.1466,18.9199 7.3406,18.7239 C7.5346,18.5259 7.8506,18.5249 8.0476,18.7179 C10.5726,21.2079 14.1366,22.2049 17.5806,21.3919 C22.8096,20.1549 26.4126,14.8009 25.4466,9.6979 C25.3946,9.4269 25.5736,9.1659 25.8446,9.1139 C26.1176,9.0659 26.3776,9.2409 26.4286,9.5129 C27.4916,15.1239 23.5446,21.0099 17.8096,22.3639 C16.9426,22.5699 16.0686,22.6709 15.2026,22.6709"></path>
                    <path d="M4.4995,15.043 C4.2795,15.043 4.0775,14.897 4.0175,14.673 C3.2275,11.738 3.6665,8.659 5.2515,6.003 C6.8945,3.249 9.5905,1.255 12.6485,0.532 C16.6815,-0.42 20.8885,0.916 23.6355,4.018 C23.8185,4.224 23.7985,4.54 23.5925,4.723 C23.3855,4.907 23.0695,4.889 22.8865,4.68 C20.3835,1.854 16.5475,0.64 12.8785,1.505 C10.0825,2.166 7.6155,3.992 6.1095,6.516 C4.6645,8.938 4.2645,11.742 4.9825,14.413 C5.0545,14.68 4.8965,14.954 4.6295,15.025 C4.5865,15.037 4.5425,15.043 4.4995,15.043"></path>
                </g>
            </svg>
        );
    }
}
