import { ReducerMap, createReducer } from "Redux/lib";
import { TimelionResult } from "Lib/types";

export interface CachedQuery {
  query: string;
  timestamp: number;
  result: TimelionResult[];
}

export interface QueryCache {
  [query: string]: CachedQuery;
}

const Actions: ReducerMap<QueryCache> = {
  SEARCH_RESULT_LOADED: (
    cache,
    {
      key,
      query,
      result
    }: { key: string; query: string; result: TimelionResult[] }
  ) => ({ ...cache, [key]: { query, result, timestamp: Date.now() } }),
  CLEAR_CACHE: (_cache, _) => ({})
};

export default createReducer({}, Actions);
