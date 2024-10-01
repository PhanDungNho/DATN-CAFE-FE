import { combineReducers } from "redux";
import productReducer from "./reducers/productReducer";
import categoryReducer from "./reducers/categoryReducer";
import commonReducer from "./reducers/commonReducer";
import  authReducer  from "./reducers/authReducer";
import  sizeReducer  from "./reducers/sizeReducer";

const rootReducer = combineReducers({
    productReducer: productReducer,
    categoryReducer: categoryReducer,
    commonReducer: commonReducer,
    auth: authReducer,
    sizeReducer: sizeReducer,

});

export default rootReducer;
