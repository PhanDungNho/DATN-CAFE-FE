import {
    ACCOUNTS_SET,
    ACCOUNT_APPEND,
    ACCOUNT_SET,
    ACCOUNT_STATE_CLEAR,
    ACCOUNT_UPDATE,
    ACCOUNT_UPDATE_ACTIVE,
  } from "../actions/actionType";
  
  const initialState = {
    account: {},
    accounts: [],
    pagination: { current: 1, pageSize: 10, total: 0 },
  };
  
  const accountReducer = (state = initialState, { type, payload }) => {
    switch (type) {
      case ACCOUNT_SET:
        return { ...state, account: payload };
      case ACCOUNTS_SET:
        return { ...state, accounts: payload };
      case ACCOUNT_STATE_CLEAR:
        return { account: {}, accounts: [] };
      case ACCOUNT_APPEND:
        return {
          ...state,
          accounts: [payload, ...state.accounts],
        };
      case ACCOUNT_UPDATE:
        const newAccounts = state.accounts.filter(
          (item) => item.username !== payload.username
        );
        return {
          ...state,
          accounts: [payload, ...newAccounts],
        };
      case ACCOUNT_UPDATE_ACTIVE:
        return {
          ...state,
          accounts: state.accounts.map((account) =>
            account.username === payload.username
              ? { ...account, active: payload.active }
              : account
          ),
        };
      default:
        return state;
    }
  };
  
 
  export default accountReducer;
  
 
