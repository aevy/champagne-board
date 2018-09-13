import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { createLogger } from "redux-logger";

const logger = createLogger({
  collapsed: true
});

const middleWare = [thunk];

const store = createStore(
  combineReducers({ ...reducers }),
  applyMiddleware(...middleWare, logger)
);

export default store;
