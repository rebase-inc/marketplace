import React, { Component, PropTypes } from 'react';

export default class CommentBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { text: '', focused: false }
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput() {
        let node = ReactDOM.findDOMNode(this.refs.comment);
        this.setState({ commentText: node.value });
    }

    render() {
        const { submit } = this.props;
        return (
            <div id='newCommentBox' className={this.state.focused || this.state.text.length}>
            <textarea 
                ref='comment' type='text' placeholder='Leave a comment' 
                value={this.state.text} 
                onFocus={() => this.setState({focused:true})} 
                onBlur={() => this.setState({focused:false})} 
                onChange={this.handleInput} />
            { 
                (this.state.focused || this.state.text.length) ? 
                    <div id='commentSubmissionButtons'>
                        <button className='small' onClick={submit.bind(null, this.state.text)}>Comment</button>
                        <button className='small' onClick={() => this.setState({ focused: false, text: ''})}>Cancel</button>
                    </div> : null
            }
            </div>
        );
    }
};
