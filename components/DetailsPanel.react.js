import React, { Component, PropTypes } from 'react';
import {humanReadableDate} from '../utils/date';

export default class DetailsPanel extends Component {
    static propTypes = {
        hidden: PropTypes.bool.isRequired,
        ticket: PropTypes.object.isRequired,
        clone: PropTypes.string.isRequired,
    }
    render() {
        const { hidden, ticket, clone } = this.props;
        let creationString ='Created ' + humanReadableDate(ticket.created);
        creationString += (ticket.discriminator == 'github_ticket') ? ' on Github' : ' on Rebase';
        return (
            <div className={hidden ? 'hidden' : 'visible'} id='itemDetails'>
                <div id='mainInfo'>
                    <span>{ticket.title}</span>
                    <span>{creationString}</span>
                    <button data-notification>Close issue</button>
                    {this.props.children}
                </div>
                <div id='technicalInfo'>
                    <CodePanelItem name='Clone' value={clone} />
                    <CodePanelItem name='Deploy' value={ticket.project.deploy} />
                    <CodePanelItem name='Test' value={ticket.project.test} />
                    <CodePanelItem name='Readme' value={ticket.project.readme} />
                </div>
            </div>
        );
    }
};

class CodePanelItem extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    }
    render() {
        const { name, value } = this.props;
        return (
            <div className='codePanelItem'>
                {name}
                {value || 'n/a'}
            </div>
        );
    }
};
