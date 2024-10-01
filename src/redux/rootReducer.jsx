import { combineReducers } from "redux";
import productReducer from "./reducers/productReducer";
import categoryReducer from "./reducers/categoryReducer";
import commonReducer from "./reducers/commonReducer";
import  authReducer  from "./reducers/authReducer";

const rootReducer = combineReducers({
    productReducer: productReducer,
    categoryReducer: categoryReducer,
    commonReducer: commonReducer,
    auth: authReducer,
});

export default rootReducer;
