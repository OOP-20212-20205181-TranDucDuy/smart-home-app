import {legacy_createStore as createStore , combineReducers} from 'redux'
const initialState = {
  accessToken: null,
  role: null,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        accessToken: action.accessToken,
        role: action.role,
      };
    case 'LOGOUT':
      return {
        ...state,
        accessToken: null,
        role: null,
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  auth: authReducer,
  // Add more reducers if needed
});

const store = createStore(rootReducer);

export default store;
