import { QueryCache } from "Redux/reducers/queryCache";
import { TimeQuery } from "Lib/types";
import { connect } from "react-redux";
import { timelionQuery } from "Redux/actions";
import QueryBuilder from "Lib/queryBuilder";

interface WithQueryCacheState {
  queryCache: QueryCache;
}

interface WithQueryCacheDispatch {
  timelionQuery: (query: QueryBuilder, time: TimeQuery, stale: number) => any;
}

export type WithQueryCache = WithQueryCacheDispatch & WithQueryCacheState;

export const withQueryCache = connect<
  WithQueryCacheState,
  WithQueryCacheDispatch,
  any,
  any
>(
  ({ queryCache }) => ({ queryCache }),
  { timelionQuery }
);
