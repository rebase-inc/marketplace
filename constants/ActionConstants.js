var keyMirror = require('keymirror');

let UserActions = keyMirror({
    LOGIN: null,
    LOGOUT: null,
    SELECT_VIEW: null,
    SELECT_ROLE: null,
});

let TicketActions = keyMirror({
    GET_TICKETS: null,
    SELECT_TICKET: null,
    CREATE_AUCTION: null, // this is a ticket action as far as scoping is considered...might imply we should change the REST API endpoint
});

let AuctionActions = keyMirror({
    GET_AUCTIONS: null,
    SELECT_AUCTION: null,
    APPROVE_NOMINATION: null,
});

let ContractActions = keyMirror({
    GET_CONTRACTS: null,
    SELECT_CONTRACT: null,
});

let __ActionConstants = keyMirror({
    UPDATE_USER_SETTINGS: null,
    UPDATE_PROFILE_PHOTO: null,
    AUTHENTICATE_GITHUB: null,
    GET_TALENT_DATA: null,
    GET_REVIEW_DATA: null,
    SELECT_CONTRACT: null,
    SELECT_REVIEW: null,
    GET_COMMENT_DETAIL: null,
    GET_USER_DETAIL: null,
    GET_USER_DETAIL_AS_MANAGER: null,
    GET_USER_DETAIL_AS_CONTRACTOR: null,
    GET_USER_DETAIL_AS_OWNER: null,
    BID_ON_AUCTION: null,
    COMMENT_ON_TICKET: null,
    ADD_COMMENT_TO_AUCTION: null,
    ADD_COMMENT_TO_TICKET: null,
    ADD_COMMENT_TO_REVIEW: null,
    SUBMIT_WORK: null,
    DISPUTE_WORK: null,
    MARK_WORK_COMPLETE: null,
    MARK_WORK_BLOCKED: null,
    MARK_WORK_UNBLOCKED: null,
    ANSWER_MEDIATION_FAILED: null,
    ANSWER_MEDIATION_PARTIALLY_COMPLETE: null,
    ANSWER_MEDIATION_COMPLETE: null,
    GET_GITHUB_ACCOUNTS: null,
    IMPORT_GITHUB_REPOS: null,
    CREATE_INTERNAL_TICKET: null,
    CREATE_GITHUB_TICKET: null,
    DELETE_PROJECT: null,
    GET_PROJECTS: null,
});

export default Object.assign({}, UserActions, TicketActions, AuctionActions, ContractActions);
