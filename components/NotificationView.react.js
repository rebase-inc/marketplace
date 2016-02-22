import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Notification from './Notification.react';

import * as NotificationActions from '../actions/NotificationActions';

class NotificationView extends Component {
    render() {
        const { notification, actions } = this.props;
        return (
            <ReactCSSTransitionGroup transitionName="notification" transitionEnterTimeout={200} transitionLeaveTimeout={2000}>
                { notification ? <Notification key={notification} text={notification} clear={actions.clearNotification} /> : null }
            </ReactCSSTransitionGroup>
        );
    }
}

let mapStateToProps = state => ({ notification: state.notification });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(NotificationActions, dispatch) });
export default connect(mapStateToProps, mapDispatchToProps)(NotificationView);
