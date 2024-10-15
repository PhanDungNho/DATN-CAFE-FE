// redux/reducers/accountReducer.js
const initialState = {
    getAccounts: [], // Hoặc giá trị mặc định khác
  };
  
  const accountReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'GET_ACCOUNTS':
        return { ...state, getAccounts: action.payload }; 
      default:
        return state;
    }
  };
  
  export default accountReducer;