import { TimeQuery, TimelionResult, TimeSeries } from "Lib/types";
import { QueryCache } from "Redux/reducers/queryCache";
import { Maybe } from "tsmonad";
import QueryBuilder from "Lib/queryBuilder";

export const getCacheKey = (query: QueryBuilder, time: TimeQuery) =>
  `${query.build()}@@${JSON.stringify(time)}`;

export const getChachedValue = (
  query: QueryBuilder,
  time: TimeQuery,
  cache: QueryCache
): Maybe<TimelionResult[]> => {
  const cacheKey = getCacheKey(query, time);
  const cachedQuery = cache[cacheKey];
  if (!cachedQuery || !cachedQuery.result) {
    return Maybe.nothing();
  } else {
    return Maybe.just(cachedQuery.result);
  }
};

export const getTimeSeries = (
  query: QueryBuilder,
  time: TimeQuery,
  cache: QueryCache
): Maybe<TimeSeries[]> =>
  getChachedValue(query, time, cache).map(results =>
    results.map(result => result.data)
  );

export const getLastCachedValues = (
  query: QueryBuilder,
  time: TimeQuery,
  cache: QueryCache
): Maybe<number[]> => {
  const mTimeSeries = getTimeSeries(query, time, cache);
  const lastValues = mTimeSeries.map(timeSeries =>
    timeSeries
      .map(timeSerie => timeSerie[timeSerie.length - 1])
      .map(lastEntry => lastEntry[1])
  );
  return lastValues;
};
