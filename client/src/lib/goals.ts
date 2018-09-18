import { thisWeekDayInterval, thisMonthDayInterval } from "Lib/timeQueries";
import { Goal } from "Lib/types";
import { QueryCache } from "Redux/reducers/queryCache";
import { getLastCachedValues } from "Lib/timelionCache";
import QB from "Lib/queryBuilder";

const goals: { [tag: string]: Goal } = {
  weeklyAccepts: {
    label: "Accepts this week",
    query: QB.create()
      .query({ action: "Accepted" })
      .cummulative(),
    time: thisWeekDayInterval,
    value: 20
  },
  weeklyPresents: {
    label: "Presentations this week",
    query: QB.create()
      .query({ action: "Presented" })
      .cummulative(),
    time: thisWeekDayInterval,
    value: 30
  },
  weeklyMeetings: {
    label: "Qualified meetings this week",
    query: QB.create()
      .query({ action: "Meeting" })
      .cummulative(),
    time: thisWeekDayInterval,
    value: 9
  },
  weeklyNewCases: {
    label: "New cases this week",
    query: QB.create()
      .query({ action: "NewCase" })
      .cummulative(),
    time: thisWeekDayInterval,
    value: 5
  },
  weeklySignedContracts: {
    label: "Signed contracts this week",
    query: QB.create()
      .query({ action: "SignedContract" })
      .cummulative(),
    time: thisWeekDayInterval,
    value: 10
  },
  weeklySentContracts: {
    label: "Sent contracts this week",
    query: QB.create()
      .query({ action: "SentContract" })
      .cummulative(),
    time: thisWeekDayInterval,
    value: 10
  },
  monthlyHires: {
    label: "Made 3 hires this month",
    query: QB.create()
      .query({ action: "hire" })
      .cummulative(),
    time: thisMonthDayInterval,
    value: 3
  },
  weeklyHire: {
    label: "Made a hire this week",
    query: QB.create()
      .query({ action: "hire" })
      .cummulative(),
    time: thisWeekDayInterval,
    value: 1
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
