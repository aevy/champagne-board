import { Dispatch } from "react-redux";
import { State } from "Redux/state";
import { TimeQuery } from "Lib/types";
import { performTimelionQuery } from "Lib/api";
import { getCacheKey } from "Lib/timelionCache";
import QueryBuilder from "Lib/queryBuilder";

export const timelionQuery = (
  query: QueryBuilder,
  timeQuery: TimeQuery,
  staleLimit = 10 * 1000
) => (dispatch: Dispatch<State>, getState: () => State) => {
  const key = getCacheKey(query, timeQuery);
  const { queryCache } = getState();
  const cachedQuery = queryCache[key];
  const minAllowedTimestamp = Date.now() - staleLimit;
  if (!!cachedQuery && cachedQuery.timestamp > minAllowedTimestamp) {
    return Promise.resolve(cachedQuery.result);
  } else {
    return performTimelionQuery(query, timeQuery).then(seriesList => {
      dispatch({
        type: "SEARCH_RESULT_LOADED",
        payload: { key, query, result: seriesList }
      });
      return seriesList;
    });
  }
};
