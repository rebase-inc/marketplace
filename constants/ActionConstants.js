var keyMirror = require('keymirror');

let UserActions = keyMirror({
    LOGIN: null,
    LOGOUT: null,
    SELECT_MODAL: null,
    SELECT_VIEW: null,
    SELECT_ROLE: null,
    UPLOAD_PHOTO: null,
    UPDATE_PROFILE: null,
    RESTORE_SESSION: null,
    ADD_SSH_KEY: null,
});

let WalkthroughActions = keyMirror({
    NEXT_WALKTHROUGH_STEP: null,
    PREVIOUS_WALKTHROUGH_STEP: null,
    EXIT_WALKTHROUGH: null,
});

let TicketActions = keyMirror({
    GET_TICKETS: null,
    CREATE_TICKET: null,
    SELECT_TICKET: null,
    CREATE_AUCTION: null, // this is a ticket action as far as scoping is considered...might imply we should change the REST API endpoint
    COMMENT_ON_TICKET: null,
});

let CreditActions = keyMirror({
    GET_CREDITS: null,
});

let DebitActions = keyMirror({
    GET_DEBITS: null,
});

let AuctionActions = keyMirror({
    GET_AUCTIONS: null,
    SELECT_AUCTION: null,
    COMMENT_ON_AUCTION: null,
    BID_ON_AUCTION: null,
    APPROVE_NOMINATION: null,
});

let ContractActions = keyMirror({
    GET_CONTRACTS: null,
    SELECT_CONTRACT: null,
    COMMENT_ON_CONTRACT: null,
    // Work actions are in the scope of contracts, so I'll consider them contract actions for now
    SUBMIT_WORK: null,
    ACCEPT_WORK: null,
    DISPUTE_WORK: null,
    MARK_WORK_BLOCKED: null,
    MARK_WORK_UNBLOCKED: null,
});

let MediationActions = keyMirror({
    MEDIATION_ANSWER: null,
});

let ReviewActions = keyMirror({
    GET_REVIEWS: null,
    SELECT_REVIEW: null,
    COMMENT_ON_REVIEW: null,
});

let GithubAccountActions = keyMirror({
    GET_GITHUB_ACCOUNTS: null,
    AUTHORIZE_GITHUB: null,
    GET_IMPORTABLE_REPOS: null,
    IMPORT_GITHUB_REPOS: null,
});

let __ActionConstants = keyMirror({
    UPDATE_USER_SETTINGS: null,
    UPDATE_PROFILE_PHOTO: null,
    AUTHENTICATE_GITHUB: null,
    GET_TALENT_DATA: null,
    GET_COMMENT_DETAIL: null,
    GET_USER_DETAIL: null,
    GET_USER_DETAIL_AS_MANAGER: null,
    GET_USER_DETAIL_AS_CONTRACTOR: null,
    GET_USER_DETAIL_AS_OWNER: null,
    COMMENT_ON_TICKET: null,
    ADD_COMMENT_TO_AUCTION: null,
    ADD_COMMENT_TO_TICKET: null,
    ADD_COMMENT_TO_REVIEW: null,
    ANSWER_MEDIATION_FAILED: null,
    ANSWER_MEDIATION_PARTIALLY_COMPLETE: null,
    ANSWER_MEDIATION_COMPLETE: null,
    GET_GITHUB_ACCOUNTS: null,
    GET_IMPORTABLE_GITHUB_REPOS: null,
    CREATE_INTERNAL_TICKET: null,
    CREATE_GITHUB_TICKET: null,
    DELETE_PROJECT: null,
    GET_PROJECTS: null,
    DELETE_MANAGER: null,
});

export default Object.assign({}, 
     UserActions, 
     TicketActions, 
     AuctionActions, 
     ContractActions, 
     ReviewActions, 
     GithubAccountActions, 
     MediationActions, 
     CreditActions, 
     DebitActions,
     WalkthroughActions,
);
