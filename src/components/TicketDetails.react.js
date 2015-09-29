var React = require('react');

var TicketDetails = React.createClass({
    render: function() {
        return (
            <div className={this.props.hidden ? 'hidden' : 'visible'} id='itemDetails'>
                <div id='mainInfo'>
                    <span>{this.props.ticket.title}</span>
                    <span>{('Created ' + (this.props.ticket.created || 'August 21, 2015')) + (this.props.ticket.descriminator == 'github_ticket' ? ' on Github' : '')}</span>
                    <button className='notification'>Close issue</button>
                </div>
                <div id='technicalInfo'>
                    <div>
                        <span>Clone</span>
                        <span>{this.props.ticket.clone_command || 'git clone git@github.com:airpool/ios'}</span>
                    </div>
                    <div>
                        <span>Deploy</span>
                        <span>{this.props.ticket.deploy_command || './manage data recreate && ./manage runserver'}</span>
                    </div>
                    <div>
                        <span>Test</span>
                        <span>{this.props.ticket.test_command || 'python tests/run.py'}</span>
                    </div>
                    <div>
                        <span>Readme</span>
                        <span>{this.props.ticket.readme_file || 'README.md'}</span>
                    </div>
                </div>
            </div>
        );
    },
});

module.exports = TicketDetails;
