var React = require('react');
var _ = require('underscore');

// Components
var FindTalentView = require('../components/FindTalentView.react');
var TicketHeader = require('../components/TicketHeader.react');
var CommentList = require('../components/CommentList.react');
var CommentBox = require('../components/CommentBox.react');
var SearchBar = require('../components/SearchBar.react');
var BidModal = require('../components/BidModal.react');
var TicketDetails = require('../components/TicketDetails.react');

var SingleAuctionView = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        currentAuction: React.PropTypes.object.isRequired,
        unselectAuction: React.PropTypes.func.isRequired,
    },
    getInitialState: () => ({ modalOpen: false, showDetails: false }),
    toggleModal: function() {
        this.setState({ modalOpen: !this.state.modalOpen });
    },
    toggleDetails: function(state) {
        typeof(state) === 'boolean' ? this.setState({ showDetails: state }) : this.setState({ showDetails: !this.state.showDetails });
    },
    render: function() {
        var buttons = [];
        var modal;
        if (!!this.props.viewingTalent) {
            return (
                <div className='auctionView'>
                    { this.state.modalOpen ? modal : null }
                    <TicketHeader goBack={this.props.leaveTalentView} title={this.props.currentAuction.ticket.title} toggleDetails={this.toggleDetails}>
                        {buttons}
                    </TicketHeader>
                    <TicketDetails hidden={!this.state.showDetails} ticket={this.props.currentAuction.ticket} />
                    <FindTalentView currentAuction={this.props.currentAuction} />
                </div>
            );
        }
        switch (this.props.currentRole.type) {
            case 'contractor':
                buttons.push(<button onClick={this.toggleModal} key='bidNow'>Bid Now</button>);
                modal = <BidModal {..._.extend({toggleModal: this.toggleModal}, {...this.props})} />
                break;
            case 'manager':
                buttons.push(<button onClick={this.props.findTalent.bind(null, null)} key='findMoreTalent'>Find More Talent</button>);
                modal = null;
                break;
        }
        return (
            <div className='auctionView'>
                { this.state.modalOpen ? modal : null }
                <TicketHeader goBack={this.props.unselectAuction} title={this.props.currentAuction.ticket.title} toggleDetails={this.toggleDetails}>
                    {buttons}
                </TicketHeader>
                <TicketDetails hidden={!this.state.showDetails} ticket={this.props.currentAuction.ticket} />
                <CommentList comments={this.props.currentAuction.ticket.comments}/>
                <CommentBox ticket={this.props.currentAuction.ticket} user={this.props.currentUser} />
            </div>
        );
    }
});

module.exports = SingleAuctionView;
