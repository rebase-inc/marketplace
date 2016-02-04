import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

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
        const { role, view, views, selectView, walkthrough, walkthroughActions } = this.props;
        const otherProps = { walkthrough, walkthroughActions };
        return (
            <div id='viewList'>
                <NewViewSelectoror role={role} select={selectView.bind(null, NEW)} selected={view.type == NEW} {...otherProps} />
                <OfferedViewSelector role={role} select={selectView.bind(null, OFFERED)} selected={view.type == OFFERED} {...otherProps} />
                <InProgressViewSelector role={role} select={selectView.bind(null, IN_PROGRESS)} selected={view.type == IN_PROGRESS} {...otherProps} />
                <CompletedViewSelector role={role} select={selectView.bind(null, COMPLETED)} selected={view.type == COMPLETED} {...otherProps} />
            </div>
        );
    }
}

export const ViewSelection = (props) => (<div className='viewSelection' data-selected={props.selected || undefined} onClick={props.select}>{props.name}</div>);

export class NewViewSelectoror extends Component {
    static propTypes = {
        walkthrough: PropTypes.object.isRequired,
        walkthroughActions: PropTypes.object.isRequired,
        select: PropTypes.object.isRequired,
        selected: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { walkthrough, walkthroughActions, select, selected, role } = this.props
        if ( role.type != 'manager' ) { return null; } // manager only view

        const tooltipVisible = walkthrough.steps[walkthrough.current] == WalkthroughConstants.NEW_TICKETS;

        return (
            <Tooltip visible={tooltipVisible} overlay={<OfferedWorkWalkthrough {...walkthroughActions} />} placement='bottomLeft'>
                <ViewSelection {...this.props} name='new'/>
            </Tooltip>
        );
    }
}

export class OfferedViewSelector extends Component {
    static propTypes = {
        walkthrough: PropTypes.object.isRequired,
        walkthroughActions: PropTypes.object.isRequired,
        select: PropTypes.object.isRequired,
        selected: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { walkthrough, walkthroughActions, select, selected, role } = this.props
        const tooltipVisible = walkthrough.steps[walkthrough.current] == WalkthroughConstants.WORK_OFFERS;

        return (
            <Tooltip visible={tooltipVisible} overlay={<OfferedWorkWalkthrough {...walkthroughActions} />} placement='bottomLeft'>
                <ViewSelection {...this.props} name={role.type == 'manager' ? 'auctions' : 'offered'}/>
            </Tooltip>
        );
    }
}

export class InProgressViewSelector extends Component {
    static propTypes = {
        walkthrough: PropTypes.object.isRequired,
        walkthroughActions: PropTypes.object.isRequired,
        select: PropTypes.object.isRequired,
        selected: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { walkthrough, walkthroughActions, select, selected, role } = this.props
        const tooltipVisible = walkthrough.steps[walkthrough.current] == WalkthroughConstants.NEW_TICKETS;

        return (
            <Tooltip visible={tooltipVisible} overlay={<OfferedWorkWalkthrough {...walkthroughActions} />} placement='bottomLeft'>
                <ViewSelection {...this.props} name={'work'}/>
            </Tooltip>
        );
    }
}

export class CompletedViewSelector extends Component {
    static propTypes = {
        walkthrough: PropTypes.object.isRequired,
        walkthroughActions: PropTypes.object.isRequired,
        select: PropTypes.object.isRequired,
        selected: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { walkthrough, walkthroughActions, select, selected, role } = this.props
        const tooltipVisible = walkthrough.steps[walkthrough.current] == WalkthroughConstants.NEW_TICKETS;

        return (
            <Tooltip visible={tooltipVisible} overlay={<OfferedWorkWalkthrough {...walkthroughActions} />} placement='bottomLeft'>
                <ViewSelection {...this.props} name={role.type == 'manager' ? 'completed' : 'reviews'}/>
            </Tooltip>
        );
    }
}

export const OfferedWorkWalkthrough = (props) => (
    <div className='walkthroughStep'>
        <h3>Your Work Offers</h3>
        <h4>Review and bid on work that has been offered to you.</h4>
        <div className='buttons'>
            <button data-quiet onClick={props.previousStep}>Back</button>
            <button data-notification onClick={props.exit}>Exit</button>
            <button data-okay onClick={props.nextStep}>Next</button>
        </div>
    </div>
);

