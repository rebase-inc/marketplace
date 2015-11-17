import React, { Component, PropTypes } from 'react';

const MonthNames = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default class ContractDetails extends Component {
    static propTypes = {
        contract: PropTypes.object.isRequired,
        hidden: PropTypes.bool.isRequired,
    }
    render() {
        const { contract, hidden } = this.props;
        let creationString = (date) => { return 'Created ' + MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(contract.ticket.created));
        creationString += (contract.ticket.discriminator == 'github_ticket') ? ' on Github' : ' on Rebase';
        let user = contract.bid.work_offers[0].contractor.user
        let name = user.first_name+' '+user.last_name
        let contractorString = 'Assigned to '+name
        let finishString = (date) => { return 'Finish work by ' + MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(contract.bid.auction.finish_work_by));
        return (
            <div className={hidden ? 'hidden' : 'visible'} id='itemDetails'>
                <div id='mainInfo'>
                    <span>{contract.ticket.title}</span>
                    <span>{creationString}</span>
                    <span>{contractorString}</span>
                    <span>{finishString}</span>
                    <button className='notification'>Close issue</button>
                </div>
                <div id='technicalInfo'>
                    <div>
                        <span>Clone</span>
                        <span>{contract.work.clone || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Deploy</span>
                        <span>{contract.ticket.project.deploy || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Test</span>
                        <span>{contract.ticket.project.test || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Readme</span>
                        <span>{contract.ticket.project.readme || 'n/a'}</span>
                    </div>
                </div>
            </div>
        );
    }
};
