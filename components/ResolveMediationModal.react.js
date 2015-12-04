import React, { Component, PropTypes } from 'react';
var ReactDOM = require('react-dom');
var keyMirror = require('keymirror');

import ModalContainer from './ModalContainer.react';
var RatingStars = require('../components/RatingStars.react');

import { RESUME_WORK, COMPLETE, FAIL } from '../constants/MediationAnswers';

var ModalStates = keyMirror({ NEW: null, GIVE_UP: null, BACK_TO_WORK: null, COMPLETE: null });

// TODO: Overhaul
var ResolveMediationModal = React.createClass({
    getInitialState: function() {
        return {
            view: ModalStates.NEW,
            text: '',
        }
    },
    propTypes: {
        close: React.PropTypes.func.isRequired,
        role: React.PropTypes.string.isRequired,
        mediation: React.PropTypes.object.isRequired,
        sendAnswer: React.PropTypes.func.isRequired,
    },
    handleInput: function() {
        this.setState({ text: ReactDOM.findDOMNode(this.refs.comment).value });
    },
    changeModalView: function(state) {
        this.setState({ view: state });
    },
    answer: function(response) {
        const { close, role, mediation, sendAnswer } = this.props;
        sendAnswer(role.type, mediation, response);
        close();
    },
    render: function() {
        const { close, role, mediation } = this.props;
        switch (this.state.view) {
            case ModalStates.NEW:
                return (
                    <ModalContainer close={close}>
                        <h3>How should the developer continue?</h3>
                        <textarea required ref='comment' placeholder="Leave a comment explaining your decision." value={this.state.text} onChange={this.handleInput}/>
                        <button className='warning' onClick={this.changeModalView.bind(null, ModalStates.GIVE_UP)}>Give Up</button>
                        <button className='needsResolution' onClick={this.changeModalView.bind(null, ModalStates.BACK_TO_WORK)}>Back to work</button>
                        <button onClick={this.changeModalView.bind(null, ModalStates.COMPLETE)}>Call it good</button>
                    </ModalContainer>
                );
                break;
            case ModalStates.GIVE_UP:
                return (
                    <ModalContainer close={close}>
                        <h3>Mark the developer's work failed?</h3>
                        <h4>If agreed upon, the developer will not be paid.</h4>
                        <textarea required ref='comment' placeholder="Leave a comment explaining why you don't think it's worth continuing." value={this.state.text} onChange={this.handleInput}/>
                        <button className='warning' onClick={this.answer.bind(null, FAIL)}>Mark Work Failed</button>
                        <h5 onClick={this.changeModalView.bind(null, ModalStates.NEW)}>Oops. Go back.</h5>
                    </ModalContainer>
                );
                break;
            case ModalStates.BACK_TO_WORK:
                return (
                    <ModalContainer close={close}>
                        <h3>Have the developer go back to work?</h3>
                        <h4>If agreed upon, the developer will continue to work on the task.</h4>
                        <textarea required ref='comment' placeholder="Leave a comment explaining your decision." value={this.state.text} onChange={this.handleInput}/>
                        <button className='needsResolution' onClick={this.answer.bind(null, RESUME_WORK)}>Go back to work</button>
                        <h5 onClick={this.changeModalView.bind(null, ModalStates.NEW)}>Oops. Go back.</h5>
                    </ModalContainer>
                );
                break;
            case ModalStates.COMPLETE:
                return (
                    <ModalContainer close={close}>
                        <h3>Mark the work finished?</h3>
                        <h4>The work will immediately be marked complete.</h4>
                        <textarea required ref='comment' placeholder="Leave a comment explaining what changed your mind." value={this.state.text} onChange={this.handleInput}/>
                        <button onClick={this.answer.bind(null, COMPLETE)}>Mark Complete</button>
                        <h5 onClick={this.changeModalView.bind(null, ModalStates.NEW)}>Oops. Go back.</h5>
                    </ModalContainer>
                );
                break;
            default: throw 'INVALID MODAL STATE'; break;
        }
    }
});

module.exports = ResolveMediationModal;
