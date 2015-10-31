import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class CommentBox extends Component {
    static propTypes = {
        submit: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { text: '', focused: false }
    }

    render() {
        const { submit } = this.props;
        return (
            <div id='newCommentBox' className={(this.state.focused || this.state.text.length) ? 'inProgress' : ''}>
            <textarea
                ref='comment' type='text' placeholder='Leave a comment'
                value={this.state.text}
                onFocus={() => this.setState({focused:true})}
                onBlur={() => this.setState({focused:false})}
                onChange={(e) => this.setState({ text: e.target.value })} />
            {
                (this.state.focused || this.state.text.length) ?
                    <div id='commentSubmissionButtons'>
                        <button className='small' onClick={() => { submit(this.state.text); this.setState({ focused: false, text: ''});}}>Comment</button>
                        <button className='small' onClick={() => this.setState({ focused: false, text: ''})}>Cancel</button>
                    </div> : null
            }
            </div>
        );
    }
};
