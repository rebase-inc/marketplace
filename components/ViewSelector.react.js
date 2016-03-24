import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import WalkthroughStep from './WalkthroughStep.react';

import Tooltip from 'rc-tooltip';

import { NEW, OFFERED, IN_PROGRESS, COMPLETED } from '../constants/ViewConstants';
import * as WalkthroughConstants from '../constants/WalkthroughConstants';

export default class ViewSelector extends Component {
    static propTypes = {
        view: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        views: PropTypes.array.isRequired,
        walkthrough: PropTypes.object.isRequired,
        walkthroughActions: PropTypes.object.isRequired,
        selectView: PropTypes.func.isRequired,
    }
    render() {
        const { role, view, selectView, walkthrough, walkthroughActions } = this.props;
        const otherProps = { walkthrough, walkthroughActions };
        return (
            <div id='viewList'>
                <NewViewSelector role={role} select={selectView.bind(null, NEW)} selected={view.type == NEW} {...otherProps} />
                <OfferedViewSelector role={role} select={selectView.bind(null, OFFERED)} selected={view.type == OFFERED} {...otherProps} />
                <InProgressViewSelector role={role} select={selectView.bind(null, IN_PROGRESS)} selected={view.type == IN_PROGRESS} {...otherProps} />
                <CompletedViewSelector role={role} select={selectView.bind(null, COMPLETED)} selected={view.type == COMPLETED} {...otherProps} />
            </div>
        );
    }
}

export const ViewSelection = (props) => (<div className='viewSelection' data-selected={props.selected || undefined} onClick={props.select}>{props.name}</div>);

export class NewViewSelector extends Component {
    static propTypes = {
        walkthrough: PropTypes.object.isRequired,
        walkthroughActions: PropTypes.object.isRequired,
        select: PropTypes.func.isRequired,
        selected: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { walkthrough, walkthroughActions, select, selected, role } = this.props
        if ( role.type != 'manager' ) { return null; } // manager only view
        const walkthroughProps = {
            role_id: role.id,
            title: 'Your Tickets',
            description: 'Review all of the tickets you\'ve created or imported from other sites and find people to work on them.',
            ...walkthroughActions
        };

        const tooltipVisible = walkthrough.steps[walkthrough.current] == WalkthroughConstants.NEW_TICKETS;

        return (
            <Tooltip visible={tooltipVisible} overlay={<WalkthroughStep {...walkthroughProps} first={true} role_id={role.id} />} placement='bottomLeft'>
                <ViewSelection {...this.props} name='tasks'/>
            </Tooltip>
        );
    }
}

export class OfferedViewSelector extends Component {
    static propTypes = {
        walkthrough: PropTypes.object.isRequired,
        walkthroughActions: PropTypes.object.isRequired,
        select: PropTypes.func.isRequired,
        selected: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { walkthrough, walkthroughActions, select, selected, role } = this.props
        const tooltipVisible = walkthrough.steps[walkthrough.current] == WalkthroughConstants.WORK_OFFERS;
        const walkthroughProps = {
            role_id: role.id,
            title: 'Your Work Offers',
            description: 'Review and bid on work that has been offered to you.',
            ...walkthroughActions
        };
        return (
            <Tooltip visible={tooltipVisible} overlay={<WalkthroughStep {...walkthroughProps} first={role.type != 'manager'} />} placement='bottomLeft'>
                <ViewSelection {...this.props} name={role.type == 'manager' ? 'auctions' : 'offered'}/>
            </Tooltip>
        );
    }
}

export class InProgressViewSelector extends Component {
    static propTypes = {
        walkthrough: PropTypes.object.isRequired,
        walkthroughActions: PropTypes.object.isRequired,
        select: PropTypes.func.isRequired,
        selected: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { walkthrough, walkthroughActions, select, selected, role } = this.props;
        const tooltipVisible = walkthrough.steps[walkthrough.current] == WalkthroughConstants.ONGOING_WORK;
        const walkthroughProps = {
            role_id: role.id,
            title: 'Your Ongoing Work',
            description: 'Review deadlines, budgets, technical details, fix issues, and ask questions about your ongoing work.',
            ...walkthroughActions
        };

        return (
            <Tooltip visible={tooltipVisible} overlay={<WalkthroughStep {...walkthroughProps} />} placement='bottomLeft'>
                <ViewSelection {...this.props} name={'work'}/>
            </Tooltip>
        );
    }
}

export class CompletedViewSelector extends Component {
    static propTypes = {
        walkthrough: PropTypes.object.isRequired,
        walkthroughActions: PropTypes.object.isRequired,
        select: PropTypes.func.isRequired,
        selected: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { walkthrough, walkthroughActions, select, selected, role } = this.props;
        const tooltipVisible = walkthrough.steps[walkthrough.current] == WalkthroughConstants.PAST_WORK;
        const walkthroughProps = {
            role_id: role.id,
            title: 'Your Completed Work',
            description: 'Review past work and see how much you earned, what you did right, and what projects you worked on.',
            ...walkthroughActions
        };

        return (
            <Tooltip visible={tooltipVisible} overlay={<WalkthroughStep {...walkthroughProps} />} placement='bottomLeft'>
                <ViewSelection {...this.props} name={role.type == 'manager' ? 'completed' : 'reviews'}/>
            </Tooltip>
        );
    }
}

