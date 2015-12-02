import React, { Component, PropTypes } from 'react';
import { humanReadableDate } from '../utils/date';
import CodeField from './CodeField.react';

export default class DetailsPanel extends Component {
    static propTypes = {
        hidden: PropTypes.bool.isRequired,
        ticket: PropTypes.object.isRequired,
        clone: PropTypes.string.isRequired,
    }
    render() {
        const { hidden, ticket, clone } = this.props;
        let creationString = 'Created ' + humanReadableDate(ticket.created);
        creationString += (ticket.discriminator == 'github_ticket') ? ' on Github' : ' on Rebase';
        return (
            <div className={hidden ? 'hidden' : 'visible'} id='detailsPanel'>
                <div id='mainInfo'>
                    <span>{ticket.title}</span>
                    <span>{creationString}</span>
                    {/*<button data-alert>Close issue</button>*/}
                    {this.props.children}
                </div>
                <div id='technicalInfo'>
                    <CodeField name='Clone (ssh)' value={clone} />
                    <CodeField name='Deploy' value={ticket.project.deploy} />
                    <CodeField name='Test' value={ticket.project.test} />
                    <CodeField name='Readme' value={ticket.project.readme} />
                </div>
            </div>
        );
    }
};
