var React = require('react');
var ReactDOM = require('react-dom');
var keyMirror = require('keymirror');

var ModalContainer = require('../components/ModalContainer.react');

var AuctionActions = require('../actions/AuctionActions');
var ContractActions = require('../actions/ContractActions');
var UserActions = require('../actions/UserActions');

var AuctionStore = require('../stores/AuctionStore');

var viewConstants = require('../constants/viewConstants');
var Graph = require('../utils/Graph');

var _ModalStates = keyMirror({ NEW: null, SUBMITTED: null, CONFIRMED: null });
var CreateAuctionModal = React.createClass({
    getInitialState: function() {
        return {view: _ModalStates.NEW}
    },
    createAuction: function() {
        AuctionActions.createAuction(this.props.ticket, this.state.cutoff_price);
        this.props.toggleModal();
    },
    setPrice: function(event) {
        this.setState({ cutoff_price: event.target.valueAsNumber });
    },
    componentDidUpdate: function() {
        var element = ReactDOM.findDOMNode(this.refs.devBellCurve);
        Graph.bellCurve.update(element, this.props, this.state);
    },
    getDefaultProps: function() {
        return { width: 240, height: 50, margin: 18 }
    },
    getInitialState: () => ({ minimum_price: 100, maximum_price: 2000, cutoff_price: 800 }),
    componentDidMount: function() {
        var element = ReactDOM.findDOMNode(this.refs.devBellCurve);
        Graph.bellCurve.create(element, this.props, this.state);
    },
    render: function() {
        return (
            <ModalContainer toggleModal={this.props.toggleModal}>
                <h3>Set your budget</h3>
                <h4>to see recommended developers</h4>
                <div className='devBellCurve' ref='devBellCurve'>
                    <input style={{width: this.props.width + 'px'}} defaultValue={this.state.cutoff_price} type='range' min={this.state.minimum_price} max={this.state.maximum_price} step={20} onChange={this.setPrice} />
                    <h3>{this.state.cutoff_price + ' USD'}</h3>
                </div>
                <button onClick={this.createAuction}>Submit Budget</button>
            </ModalContainer>
        );
    }
});

module.exports = CreateAuctionModal;
