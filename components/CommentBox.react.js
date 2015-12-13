import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

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


// TODO: Overhaul. Also, look for a way to avoid having to use dangerouslySetInnerHTML
export default class CommentBox extends Component {
    static propTypes = {
        submit: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { text: '', focused: false, preview: false }
    }

    render() {
        const { submit } = this.props;
        return (
            <div id='commentBox'>
                <textarea
                    ref='comment' type='text' placeholder='Leave a comment'
                    value={this.state.text}
                    onFocus={() => this.setState({focused:true})}
                    onBlur={() => this.setState({focused:false})}
                    onChange={(e) => this.setState({ text: e.target.value })} />
                <div className='buttons'>
                    <TrashIcon onClick={() => this.setState({ text: '' })} />
                    <button data-okay disabled={!this.state.text.length || undefined} onClick={() => { submit(this.state.text); this.setState({ preview: false, focused: false, text: ''});}}>Comment</button>
                </div>
            </div>
        );
    }
};

export class TrashIcon extends Component {
    render() {
        return (
            <svg width="18px" height="18px" viewBox="0 0 24 24" onClick={this.props.onClick}>
                <g stroke="none" stroke-width="1" fill="#231F1F">
                    <path d="M4,23.2 L19.2,23.2 L19.2,4 L4,4 L4,23.2 Z M19.6,24 L3.6,24 C3.3792,24 3.2,23.8208 3.2,23.6 L3.2,3.6 C3.2,3.3792 3.3792,3.2 3.6,3.2 L19.6,3.2 C19.8208,3.2 20,3.3792 20,3.6 L20,23.6 C20,23.8208 19.8208,24 19.6,24 L19.6,24 Z"></path>
                    <path d="M8,3.2 L15.2,3.2 L15.2,0.8 L8,0.8 L8,3.2 Z M15.6,4 L7.6,4 C7.3792,4 7.2,3.8208 7.2,3.6 L7.2,0.4 C7.2,0.1792 7.3792,0 7.6,0 L15.6,0 C15.8208,0 16,0.1792 16,0.4 L16,3.6 C16,3.8208 15.8208,4 15.6,4 L15.6,4 Z"></path>
                    <path d="M22.8,4 L0.4,4 C0.1792,4 0,3.8208 0,3.6 C0,3.3792 0.1792,3.2 0.4,3.2 L22.8,3.2 C23.0208,3.2 23.2,3.3792 23.2,3.6 C23.2,3.8208 23.0208,4 22.8,4"></path>
                    <path d="M7.6,19.6 C7.3792,19.6 7.2,19.4208 7.2,19.2 L7.2,8 C7.2,7.7792 7.3792,7.6 7.6,7.6 C7.8208,7.6 8,7.7792 8,8 L8,19.2 C8,19.4208 7.8208,19.6 7.6,19.6"></path>
                    <path d="M11.6,19.6 C11.3792,19.6 11.2,19.4208 11.2,19.2 L11.2,8 C11.2,7.7792 11.3792,7.6 11.6,7.6 C11.8208,7.6 12,7.7792 12,8 L12,19.2 C12,19.4208 11.8208,19.6 11.6,19.6"></path>
                    <path d="M15.6,19.6 C15.3792,19.6 15.2,19.4208 15.2,19.2 L15.2,8 C15.2,7.7792 15.3792,7.6 15.6,7.6 C15.8208,7.6 16,7.7792 16,8 L16,19.2 C16,19.4208 15.8208,19.6 15.6,19.6"></path>
                </g>
            </svg>
        );
    }
}
