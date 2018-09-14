import { thisWeekDayInterval } from "Lib/timeQueries";
import { Goal } from "Lib/types";
import { QueryCache } from "Redux/reducers/queryCache";
import { getLastCachedValues } from "Lib/timelionCache";
import QB from "Lib/queryBuilder";

const goals: { [tag: string]: Goal } = {
  weeklyAccepts: {
    label: "Accepts this week",
    query: QB.create()
      .query({ action: "accepted" })
      .cummulative(),
    time: thisWeekDayInterval,
    value: 20
  },
  weeklyPresents: {
    label: "Presentations this week",
    query: QB.create()
      .query({ action: "presented" })
      .cummulative(),
    time: thisWeekDayInterval,
    value: 30
  }
};

export const goalList: (Goal & { tag: string })[] = Object.keys(goals).map(
  tag => ({ tag, ...goals[tag] })
);

export const isGoalFulilled = (queryCache: QueryCache, goal?: Goal) => {
  if (!goal) {
    return false;
  }
  const fulfilled = getLastCachedValues(goal.query, goal.time, queryCache)
    .map(values => values[0])
    .map(lastValue => lastValue >= goal.value)
    .valueOr(false);
  return fulfilled;
};

export default goals;
