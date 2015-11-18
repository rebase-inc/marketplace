import React, { Component, PropTypes } from 'react';
import TicketTitle from './TicketTitle.react';
import TicketCreated from './TicketCreated.react';
import CodePanel from './CodePanel.react';

export default class DetailsPanel extends Component {
    static propTypes = {
        hidden: PropTypes.bool.isRequired,
        ticket: PropTypes.object.isRequired,
        clone: PropTypes.string.isRequired,
    }
    render() {
        const { hidden, ticket, clone } = this.props;
        return (
            <div className={hidden ? 'hidden' : 'visible'} id='itemDetails'>
                <div id='mainInfo'>
                    <TicketTitle title={ticket.title} />
                    <TicketCreated created={ticket.created} discriminator={ticket.discriminator}/>
                    <button className='notification'>Close issue</button>
                    {this.props.children}
                </div>
                <CodePanel clone={clone} deploy={ticket.project.deploy} test={ticket.project.test} readme={ticket.project.readme} />
            </div>
        );
    }
};
