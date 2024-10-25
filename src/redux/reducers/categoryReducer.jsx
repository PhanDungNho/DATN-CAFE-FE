import {
  CATEGORIES_SET,
  CATEGORY_APPEND,
  CATEGORY_SET,
  CATEGORY_STATE_CLEAR,
  CATEGORY_UPDATE,
  CATEGORY_UPDATE_ACTIVE,
} from "../actions/actionType";

const initialState = {
  category: {},
  categories: [],
};

const categoryReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CATEGORY_SET:
      return { ...state, category: payload };
    case CATEGORIES_SET:
      return { ...state, categories: payload };
    case CATEGORY_STATE_CLEAR:
      return { category: {}, categories: [] };
    case CATEGORY_APPEND:
      return {
        ...state,
        categories: [payload, ...state.categories],
      };
    case CATEGORY_UPDATE:
      const newCategories = state.categories.filter(
        (item) => item.id !== payload.id
      );
      return {
        ...state,
        categories: [payload, ...newCategories],
      };
    case CATEGORY_UPDATE_ACTIVE:
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === payload.id
            ? { ...category, active: payload.active }
            : category
        ),
      };
     
    default:
      return state;
  }
};

export default categoryReducer;
