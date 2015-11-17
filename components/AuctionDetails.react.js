import React, { Component, PropTypes } from 'react';

const MonthNames = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default class AuctionDetails extends Component {
    static propTypes = {
        auction: PropTypes.object.isRequired,
        hidden: PropTypes.bool.isRequired,
    }
    render() {
        const { auction, hidden } = this.props;
        let creationString = (date) => { return 'Created ' + MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(auction.ticket.created));
        creationString += (auction.ticket.discriminator == 'github_ticket') ? ' on Github' : ' on Rebase';
        let finishString = (date) => { return 'Finish work by ' + MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(auction.finish_work_by));
        return (
            <div className={hidden ? 'hidden' : 'visible'} id='itemDetails'>
                <div id='mainInfo'>
                    <span>{auction.ticket.title}</span>
                    <span>{creationString}</span>
                    <span>{finishString}</span>
                    <button className='notification'>Close issue</button>
                </div>
                <div id='technicalInfo'>
                    <div>
                        <span>Clone</span>
                        <span>{auction.ticket.project.work_repo.clone || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Deploy</span>
                        <span>{auction.ticket.project.deploy || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Test</span>
                        <span>{auction.ticket.project.test || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Readme</span>
                        <span>{auction.ticket.project.readme || 'n/a'}</span>
                    </div>
                </div>
            </div>
        );
    }
};
