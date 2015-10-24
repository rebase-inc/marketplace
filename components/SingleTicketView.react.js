var React = require('react');
var _ = require('underscore');

// Components
var FindTalentView = require('../components/FindTalentView.react');
var TicketHeader = require('../components/TicketHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');
var SearchBar = require('../components/SearchBar.react');
var CreateAuctionModal = require('../components/CreateAuctionModal.react');
var TicketDetails = require('../components/TicketDetails.react');

var SingleTicketView = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        currentTicket: React.PropTypes.object.isRequired,
        unselectTicket: React.PropTypes.func.isRequired,
        findTalent: React.PropTypes.func.isRequired,
        modalOpen: React.PropTypes.bool.isRequired,
    },
    getInitialState: () => ({ modalOpen: false, showDetails: false }),
    toggleDetails: function(state) {
        typeof(state) === 'boolean' ? this.setState({ showDetails: state }) : this.setState({ showDetails: !this.state.showDetails });
    },
    render: function() {
        var buttons = [];
        if (!!this.props.viewingTalent) {
            return (
                <div className='auctionView'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}/>
                    <FindTalentView />;
                </div>
            );
        }
        switch (this.props.currentRole.type) {
            case 'contractor': throw 'Invalid view for contractor role!'; break;
            case 'manager':
                buttons.push(<button onClick={this.props.findTalent.bind(null, null)} key='findMoreTalent'>Find Talent</button>);
                break;
        }
        return (
            <div className='ticketView'>
                { this.props.modalOpen ? <CreateAuctionModal ticket={this.props.currentTicket} toggleModal={this.props.toggleModal} /> : null }
                <TicketHeader goBack={this.props.unselectTicket} title={this.props.currentTicket.title} toggleDetails={this.toggleDetails}>
                    {buttons}
                </TicketHeader>
                <TicketDetails hidden={!this.state.showDetails} ticket={this.props.currentTicket} />
                <CommentList comments={this.props.currentTicket.comments}/>
                <CommentBox ticket={this.props.currentTicket} user={this.props.currentUser} />
            </div>
        );
    }
});

module.exports = SingleTicketView;
