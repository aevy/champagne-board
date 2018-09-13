import { TimeQuery } from "Lib/types";

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const thisWeekDayInterval: TimeQuery = {
  from: "now/w",
  to: "now/w",
  timezone,
  interval: "1d",
  mode: "quick"
};

export const thisMonthDayInterval: TimeQuery = {
  from: "now/M",
  to: "now/M",
  timezone,
  interval: "1d",
  mode: "quick"
};
