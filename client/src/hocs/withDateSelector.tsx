import React from "react";
import { TimeQuery, TimeUnit } from "Lib/types";

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const getDateType = (d: TimeUnit) =>
  d === "day"
    ? "d"
    : d === "week"
      ? "w"
      : d === "month"
        ? "M"
        : d === "year"
          ? "y"
          : "";

export type DateRange =
  | {
      label: string;
      mode: "quick";
      type: TimeUnit;
    }
  | {
      label: string;
      mode: "relative";
      from: {
        unit: TimeUnit;
        amount: number;
      };
      to: {
        unit: TimeUnit;
        amount: number;
      };
    };

export const dateRangeToTimeQuery = (
  dateRange: DateRange,
  interval: TimeUnit
): TimeQuery => {
  const intervalString = `1${getDateType(interval)}`;
  if (dateRange.mode === "relative") {
    const { from, to } = dateRange;
    return {
      from: `now-${from.amount}${getDateType(from.unit)}`,
      to: `now-${to.amount}${getDateType(to.unit)}`,
      mode: "relative",
      timezone,
      interval: intervalString
    };
  } else if (dateRange.mode === "quick") {
    const { type } = dateRange;
    return {
      from: `now/${getDateType(type)}`,
      to: `now/${getDateType(type)}`,
      timezone,
      mode: "quick",
      interval: intervalString
    };
  }
};

interface ExtendedDateProps {
  selectedDateRange: DateRange;
  selectedDateInterval: TimeUnit;
  selectDateRange: (dateRange: DateRange) => void;
  selectDateInterval: (dateInterval: TimeUnit) => void;
  selectedTimeQuery: TimeQuery;
}

interface ExtendedDateState {
  selectedDateRange: DateRange;
  selectedDateInterval: TimeUnit;
}

const defaultDateRange: DateRange = {
  label: "This week",
  mode: "quick",
  type: "week"
};
const defaultDateInterval = "day";

const withDateSelector = <Props, LocalState>(
  component:
    | React.StatelessComponent<Props & ExtendedDateProps>
    | React.ComponentClass<Props & ExtendedDateProps, any>
) => {
  class ExtendWithDateSelector extends React.Component<
    Props,
    LocalState & ExtendedDateState
  > {
    constructor(props: Props) {
      super(props);
      this.selectDateRange = this.selectDateRange.bind(this);
      this.selectDateInterval = this.selectDateInterval.bind(this);

      (this.state as any) = {
        selectedDateInterval: defaultDateInterval,
        selectedDateRange: defaultDateRange
      };
    }

    selectDateInterval(selectedDateInterval: TimeUnit) {
      this.setState({ selectedDateInterval });
    }

    selectDateRange(selectedDateRange: DateRange) {
      this.setState({ selectedDateRange });
    }
    render() {
      const { props }: any = this;
      const { selectedDateInterval, selectedDateRange } = this.state;
      const selectedTimeQuery = dateRangeToTimeQuery(
        selectedDateRange,
        selectedDateInterval
      );
      const extendedProps: ExtendedDateProps = {
        selectedTimeQuery,
        selectedDateRange,
        selectedDateInterval,
        selectDateInterval: this.selectDateInterval,
        selectDateRange: this.selectDateRange
      };
      return React.createElement(component, {
        ...props,
        ...extendedProps
      });
    }
  }
  return ExtendWithDateSelector;
};

export default withDateSelector;
