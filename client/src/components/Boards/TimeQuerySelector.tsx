import React from "react";
import _ from "lodash";
import { DateRange } from "HOC/withDateSelector";
import { TimeQuery, Option, TimeUnit } from "Lib/types";
import { OptionSelector, NumberInput, Row } from "Components/Blocks";
import css from "./styles.less";

const modeOptions: Option<DateRange>[] = [
  { label: "Quick", value: { mode: "quick", type: "week", label: "Quick" } },
  {
    label: "Relative",
    value: {
      mode: "relative",
      from: { unit: "week", amount: 1 },
      to: { unit: "week", amount: 0 },
      label: "Relative"
    }
  }
];

const quickTypeOptions: Option<TimeUnit>[] = [
  { label: "This week", value: "week" },
  { label: "This month", value: "month" },
  { label: "This year", value: "year" }
];

const rangeUnitOptions: Option<TimeUnit>[] = [
  { label: "Days", value: "day" },
  { label: "Weeks", value: "week" },
  { label: "Months", value: "month" }
];

const intervalOptions: Option<TimeUnit>[] = [
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" }
];

const cummulativeOptions: Option<boolean>[] = [
  { label: "Yes", value: true },
  { label: "No", value: false }
];

interface Props {
  pollFrequency: number;
  setPollFrequency: (pollFrequency: number) => void;
  chartCummulative: boolean;
  setChartCummulative: (c: boolean) => void;
  selectedDateRange: DateRange;
  selectedDateInterval: string;
  selectDateRange: (dateRange: DateRange) => void;
  selectDateInterval: (dateInterval: string) => void;
  selectedTimeQuery: TimeQuery;
}

const TimeQuerySelector: React.StatelessComponent<Props> = ({
  pollFrequency,
  setPollFrequency,
  chartCummulative,
  setChartCummulative,
  selectDateInterval,
  selectedDateInterval,
  selectedDateRange,
  selectDateRange
}) => (
  <div className={css.root}>
    <Row className={css.row}>
      <OptionSelector<DateRange>
        availableOptions={modeOptions}
        selectedValue={selectedDateRange}
        getKey={dateRange => dateRange.mode}
        onSelect={mode => selectDateRange(mode)}
      />
    </Row>
    {selectedDateRange.mode === "quick" ? (
      <Row className={css.row}>
        <OptionSelector<TimeUnit>
          availableOptions={quickTypeOptions}
          selectedValue={selectedDateRange.type}
          onSelect={type => selectDateRange({ ...selectedDateRange, type })}
        />
      </Row>
    ) : null}
    {selectedDateRange.mode === "relative" ? (
      <>
        <Row className={css.row}>
          <span className={css.label}>From:</span>
          <NumberInput
            className={css.input}
            value={selectedDateRange.from.amount}
            onChange={amount =>
              selectDateRange(_.merge(selectedDateRange, { from: { amount } }))
            }
          />
          <OptionSelector<TimeUnit>
            availableOptions={rangeUnitOptions}
            selectedValue={selectedDateRange.from.unit}
            onSelect={unit =>
              selectDateRange(_.merge(selectedDateRange, { from: { unit } }))
            }
          />
          <span className={css.label}>ago</span>
        </Row>
        <Row className={css.row}>
          <span className={css.label}>To:</span>
          <NumberInput
            className={css.input}
            value={selectedDateRange.to.amount}
            onChange={amount =>
              selectDateRange(_.merge(selectedDateRange, { to: { amount } }))
            }
          />
          <OptionSelector<TimeUnit>
            availableOptions={rangeUnitOptions}
            selectedValue={selectedDateRange.to.unit}
            onSelect={unit =>
              selectDateRange(_.merge(selectedDateRange, { to: { unit } }))
            }
          />
          <span className={css.label}>ago</span>
        </Row>
      </>
    ) : null}
    <Row className={css.row}>
      <span className={css.label}>Granularity</span>
      <OptionSelector<string>
        availableOptions={intervalOptions}
        selectedValue={selectedDateInterval}
        onSelect={selectDateInterval}
      />
    </Row>
    <Row>
      <span className={css.label}>Cummulative chart?</span>
      <OptionSelector<boolean>
        availableOptions={cummulativeOptions}
        selectedValue={chartCummulative}
        onSelect={setChartCummulative}
      />
    </Row>
    <Row>
      <span className={css.label}>Poll frequency</span>
      <NumberInput
        className={css.input}
        value={pollFrequency}
        onChange={setPollFrequency}
      />
      <span className={css.label}>seconds between requests</span>
    </Row>
  </div>
);

export default TimeQuerySelector;
