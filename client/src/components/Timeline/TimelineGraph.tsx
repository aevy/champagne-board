import React from "react";
import { Box, TimelionResult, DataPoint, TimeUnit } from "Lib/types";
import { scaleTime, scaleLinear } from "d3-scale";
import css from "./styles.less";
import { Loader } from "Components/Blocks";
import XAxis from "./XAxis";
import _ from "lodash";
import Timeline from "./Timeline";
import defaults from "./defaults";
import YAxis, { YAxisTickType } from "Components/Timeline/YAxis";
import Legend from "Components/Timeline/Legend";
import classNames from "classnames";

interface Props {
  timelionResults: TimelionResult[];
  xTicks: TimeUnit;
  yTicks: YAxisTickType;
  margin: Box;
  colorScheme?: string[];
}

interface LocalState {
  followTimeSeries: number;
  height: number;
  width: number;
  elem: HTMLElement;
  selectedDataPoints: DataPoint[];
}

const getMinTimestamp = (timelionResults: TimelionResult[]) =>
  _.chain(timelionResults)
    .map(tlResult => tlResult.data[0][0])
    .min()
    .value();
const getMaxTimestamp = (timelionResults: TimelionResult[]) =>
  _.chain(timelionResults)
    .map(tlResult => tlResult.data[tlResult.data.length - 1][0])
    .max()
    .value();
const getMaxVal = (timelionResults: TimelionResult[]) =>
  _.chain(timelionResults)
    .map(tlResult =>
      _.chain(tlResult.data)
        .map(([_ts, val]) => val)
        .max()
        .value()
    )
    .max()
    .value();

const resultsAreEmpty = (timelionResults: TimelionResult[]) =>
  _.every(
    timelionResults,
    (tlResult: TimelionResult) => tlResult.data.length === 0
  );

class TimelineGraph extends React.Component<Props, LocalState> {
  constructor(props: Props) {
    super(props);
    (this as any).divRef = React.createRef();
    this.selectDataPoints = this.selectDataPoints.bind(this);
    this.clearDataPoints = this.clearDataPoints.bind(this);
    this.setFollowTimeSeries = this.setFollowTimeSeries.bind(this);

    this.state = {
      followTimeSeries: null,
      height: 0,
      width: 0,
      elem: null,
      selectedDataPoints: []
    };
  }

  selectDataPoints(timestamp: number) {
    const selectedDataPoints = _.map(this.props.timelionResults, tlResult =>
      _.find(tlResult.data, ([x, _]) => x >= timestamp)
    );
    this.setState({ selectedDataPoints });
  }

  setFollowTimeSeries(timeSeriesIndex: number) {
    const { timelionResults } = this.props;
    if (this.state.followTimeSeries === timeSeriesIndex) {
      this.setState({ followTimeSeries: null });
    } else if (timeSeriesIndex < timelionResults.length) {
      this.setState({ followTimeSeries: timeSeriesIndex });
    }
  }

  clearDataPoints() {
    this.setState({ selectedDataPoints: [] });
  }

  render() {
    const elem = (this as any).divRef.current as HTMLElement;
    const height = !!elem ? elem.clientHeight : 0;
    const width = !!elem ? elem.clientWidth : 0;

    const { timelionResults, margin, xTicks, yTicks } = this.props;
    const { followTimeSeries } = this.state;
    if (!timelionResults) {
      return (
        <div ref={(this as any).divRef} className={css.chart}>
          <Loader />
        </div>
      );
    }
    if (resultsAreEmpty(timelionResults)) {
      return (
        <div
          ref={(this as any).divRef}
          className={classNames(css.chart, css.noData)}>
          <span>No data found ¯\_(ツ)_/¯ </span>
        </div>
      );
    }
    const minDate = getMinTimestamp(timelionResults);
    const maxDate = getMaxTimestamp(timelionResults);
    const maxVal = getMaxVal(timelionResults);
    const xScale = scaleTime()
      .domain([minDate, maxDate])
      .range([margin.left, width - margin.right]);
    const yScale = scaleLinear()
      .domain([0, maxVal * defaults.Y_SCALE_MAX_FACTOR])
      .range([height - margin.bottom, margin.top]);
    const colorScheme = this.props.colorScheme || defaults.COLOR_SCHEME;

    const legends = _.map(timelionResults, (timelionResult, idx) => {
      const x = width - margin.right + defaults.LEGEND_OFFSET_X;
      const y =
        margin.top + defaults.LEGEND_OFFSET_Y + defaults.LEGEND_STEP_Y * idx;
      return (
        <Legend
          selected={idx === followTimeSeries}
          onClick={() => this.setFollowTimeSeries(idx)}
          timelionResult={timelionResult}
          x={x}
          y={y}
          color={colorScheme[idx]}
        />
      );
    });

    const timelines = _.map(timelionResults, ({ data }, idx) => (
      <Timeline
        selected={idx === followTimeSeries}
        onClick={() => this.setFollowTimeSeries(idx)}
        timeSeries={data}
        xScale={xScale}
        yScale={yScale}
        stroke={colorScheme[idx]}
      />
    ));

    const timeSeriesIsSelected =
      followTimeSeries !== null && !!timelionResults[followTimeSeries];

    const showDataPoints = timeSeriesIsSelected
      ? timelionResults[followTimeSeries].data
      : this.state.selectedDataPoints;

    const highlightDataPoints = _.chain(showDataPoints)
      .filter(Boolean)
      .map(([timestamp, val], idx) => (
        <g
          transform={`translate(${xScale(timestamp)},${yScale(val)})`}
          className={css.dataPoint}>
          <circle
            r={defaults.POINT_RADIUS}
            fill={timeSeriesIsSelected ? "#fff" : colorScheme[idx]}
            cx={0}
            cy={0}
          />
          <text
            x={defaults.POINT_LABEL_OFFSET_X}
            y={defaults.POINT_LABEL_OFFSET_Y}>
            {val}
          </text>
        </g>
      ))
      .value();
    const [yAxisX1, yAxisX2] = xScale.range();
    const [xAxisY1, xAxisY2] = yScale.range();
    return (
      <div ref={(this as any).divRef} className={css.chart}>
        <svg height={height} width={width}>
          <YAxis scale={yScale} tickType={yTicks} x1={yAxisX1} x2={yAxisX2} />
          <XAxis
            onHover={this.selectDataPoints}
            onMouseOut={this.clearDataPoints}
            scale={xScale}
            ticks={xTicks}
            y1={xAxisY1}
            y2={xAxisY2}
          />
          {...legends}
          {...timelines}
          {...highlightDataPoints}
        </svg>
      </div>
    );
  }
}

export default TimelineGraph;
