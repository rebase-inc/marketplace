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

    rawMarkup() {
        var rawMarkup = marked(this.state.text, {sanitize: true});
        return { __html: rawMarkup };
    }

    render() {
        const { submit } = this.props;
        return (
            <div id='commentBox' className={(this.state.focused || this.state.text.length) ? 'inProgress' : ''}>
            { this.state.preview ? <div id='commentPreview' dangerouslySetInnerHTML={this.rawMarkup()}/> : null }
            { this.state.preview ? null :<textarea
                ref='comment' type='text' placeholder='Leave a comment'
                value={this.state.text}
                onFocus={() => this.setState({focused:true})}
                onBlur={() => this.setState({focused:false})}
                onChange={(e) => this.setState({ text: e.target.value })} /> }
            {
                (this.state.focused || this.state.text.length) ?
                    <div id='commentSubmissionButtons'>
                        <button data-okay className='small' onClick={() => { submit(this.state.text); this.setState({ preview: false, focused: false, text: ''});}}>Comment</button>
                        { this.state.preview ?
                            <button data-notification className='small' onClick={() => this.setState({ preview: false })}>Edit</button> :
                            <button data-notification className='small' onClick={() => this.setState({ preview: true })}>Preview</button> }
                    </div> : null
            }
            </div>
        );
    }
};
