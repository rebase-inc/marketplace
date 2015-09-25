var React = require('react');
var ReactDOM = require('react-dom');
var keyMirror = require('keymirror');

var ModalContainer = require('../components/ModalContainer.react');

var AuctionActions = require('../actions/AuctionActions');
var ContractActions = require('../actions/ContractActions');
var UserActions = require('../actions/UserActions');

var AuctionStore = require('../stores/AuctionStore');

var viewConstants = require('../constants/viewConstants');

var _ModalStates = keyMirror({ NEW: null, SUBMITTED: null, CONFIRMED: null });
var CreateAuctionModal = React.createClass({
    getInitialState: function() {
        return {view: _ModalStates.NEW}
    },
    handleKeyPress: function(event) {
        if (event.charCode == 13) {
            this.setState({ price: ReactDOM.findDOMNode(this.refs.price).value, view: _ModalStates.SUBMITTED });
        }
    },
    createAuction: function() {
        AuctionActions.createAuction(this.props.ticket, this.state.price);
        this.props.toggleModal();
    },
    render: function() {
        switch (this.state.view) {
            case (_ModalStates.NEW):
                return (
                    <ModalContainer>
                        <div onClick={this.props.toggleModal} id='modalClose'>
                            <img src='img/modal-close.svg'/>
                        </div>
                        <h3>Set your budget</h3>
                        <h4>to see recommended developers</h4>
                        <input type='number' ref='price' placeholder='Budget in USD' onKeyPress={this.handleKeyPress}/>
                    </ModalContainer>
                );
                break;
            case (_ModalStates.SUBMITTED):
                return (
                    <ModalContainer>
                        <div onClick={this.props.toggleModal} id='modalClose'>
                            <img src='img/modal-close.svg'/>
                        </div>
                        <h3>{'Is ' + this.state.price + ' USD Correct?'}</h3>
                        <h4>This just sets a limit. Usually, you'll pay much less</h4>
                        <button onClick={this.createAuction}>Submit Budget</button>
                    </ModalContainer>
                );
                break;
            default: throw "ERROR"; break;
        }
    }
});

module.exports = CreateAuctionModal;
