import { TimeQuery, TimelionResult } from "Lib/types";
import QueryBuilder from "Lib/queryBuilder";

export const performTimelionQuery = (
  query: QueryBuilder,
  time: TimeQuery
): Promise<TimelionResult[]> => {
  return fetch("/api/search/timelion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query.build(),
      time
    })
  })
    .then(res => res.json())
    .then(data => data.list);
};
