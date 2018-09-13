import React from "react";
import css from "./styles.less";
import { ScaleTime } from "d3";
import range from "lodash/range";
import moment from "moment";
import defaults from "./defaults";
import classNames from "classnames";
import { TimeUnit } from "Lib/types";

interface Props {
  scale: ScaleTime<number, number>;
  ticks: TimeUnit;
  onHover?: (x: number) => void;
  onMouseOut?: () => void;
  y1: number;
  y2: number;
}

const formatTimestampFactory = (ticks: TimeUnit) => {
  if (ticks === "day") {
    return (timestamp: moment.Moment) => timestamp.format("ddd");
  } else if (ticks === "week") {
    return (timestamp: moment.Moment) => timestamp.format("D/M");
  } else if (ticks === "month") {
    return (timestamp: moment.Moment) => timestamp.format("MMM");
  }
};

export default class XAxis extends React.Component<Props> {
  render() {
    const { ticks, scale, y1, y2, onHover, onMouseOut } = this.props;
    const [min, max] = scale.domain().map(d => moment(d));
    const duration = moment.duration(1, ticks).asMilliseconds();
    const timestampFormatter = formatTimestampFactory(ticks);
    const steps = 1 + max.diff(min) / duration; // Fence post count
    const lines = range(steps).map(i => {
      const timestamp = new Date(min.valueOf() + i * duration);
      const timestampText = timestampFormatter(moment(timestamp));
      const x = scale(timestamp);
      return (
        <g
          key={x}
          className={classNames(css.grid, css.yGrid)}
          onMouseOut={onMouseOut}
          onMouseOver={() => onHover(timestamp.valueOf())}>
          <line x1={x} x2={x} y1={y1} y2={y2} />
          <text
            x={x + defaults.X_AXIS_LABEL_OFFSET_PX_X}
            y={y1 + defaults.X_AXIS_LABEL_OFFSET_PX_Y}>
            {timestampText}
          </text>
        </g>
      );
    });
    return <g>{...lines}</g>;
  }
}
