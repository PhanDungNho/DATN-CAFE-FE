import { combineReducers } from "redux";
import productReducer from "./reducers/productReducer";
import categoryReducer from "./reducers/categoryReducer";
import commonReducer from "./reducers/commonReducer";
import  authReducer  from "./reducers/authReducer";
import  sizeReducer  from "./reducers/sizeReducer";
import  toppingReducer  from "./reducers/toppingReducer";
import  authorityReducer  from "./reducers/authorityReducer";

import  invoiceReducer  from "./reducers/invoiceReducer";
import  accountReducer  from "./reducers/accountReducer";
import  decentralizationReducer  from "./reducers/authorityReducer";
import productVariantReducer from "./reducers/productVariantReducer";
import cartDetailReducer from "./reducers/cartDetailReducer";


const rootReducer = combineReducers({
    productReducer: productReducer,
    categoryReducer: categoryReducer,
    commonReducer: commonReducer,
    auth: authReducer,
    sizeReducer: sizeReducer,
    productVariantReducer: productVariantReducer,
    authorityReducer:authorityReducer,
    invoiceReducer: invoiceReducer,
    toppingReducer: toppingReducer,
    accountReducer: accountReducer,
    decentralizationReducer: decentralizationReducer,
    cartDetailReducer: cartDetailReducer,
});

export default rootReducer;
