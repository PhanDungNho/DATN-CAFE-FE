import { combineReducers } from "redux";
import productReducer from "./reducers/productReducer";
import categoryReducer from "./reducers/categoryReducer";
import commonReducer from "./reducers/commonReducer";
import  authReducer  from "./reducers/authReducer";
import  sizeReducer  from "./reducers/sizeReducer";
import  toppingReducer  from "./reducers/toppingReducer";

import  invoiceReducer  from "./reducers/invoiceReducer";
import  accountReducer  from "./reducers/accountReducer";
import  decentralizationReducer  from "./reducers/authorityReducer";


const rootReducer = combineReducers({
    productReducer: productReducer,
    categoryReducer: categoryReducer,
    commonReducer: commonReducer,
    auth: authReducer,
    sizeReducer: sizeReducer,

    invoiceReducer: invoiceReducer,
    toppingReducer: toppingReducer,
    accountReducer: accountReducer,
    decentralizationReducer: decentralizationReducer,

});

export default rootReducer;
