var React = require('react');
var _ = require('underscore');

// Components
var TicketHeader = require('../components/TicketHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');
var SearchBar = require('../components/SearchBar.react');
var BidModal = require('../components/BidModal.react');

var SingleAuctionView = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        currentAuction: React.PropTypes.object.isRequired,
        unselectAuction: React.PropTypes.func.isRequired,
    },
    getInitialState: function() {
        return { modalOpen: false };
    },
    toggleModal: function() {
        this.setState({ modalOpen: !this.state.modalOpen });
    },
    render: function() {
        var buttons = [];
        var modal;
        if (!!this.props.viewingTalent) {
            return (
                <div className='mainContent'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}/>
                    <FindTalentView />;
                </div>
            );
        }

        switch (this.props.currentRole.type) {
            case 'contractor':
                buttons.push(<button onClick={this.toggleModal}>Bid Now</button>);
                modal = <BidModal {..._.extend({toggleModal: this.toggleModal}, {...this.props})} />
                break;
            case 'manager':
                buttons.push(<button onClick={this.toggleModal}>Find More Talent</button>);
                modal = null;
                break;
        }
        return (
            <div className='auctionView'>
                { this.state.modalOpen ? modal : null }
                <TicketHeader goBack={this.props.unselectAuction} title={this.props.currentAuction.ticket.title}>
                    {buttons}
                </TicketHeader>
                <CommentList comments={this.props.currentAuction.ticket.comments}/>
                <CommentBox ticket={this.props.currentAuction.ticket} user={this.props.currentUser} />
            </div>
        );
    }
});

module.exports = SingleAuctionView;
