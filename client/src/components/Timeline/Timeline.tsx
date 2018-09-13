import React from "react";
import { TimeSeries } from "Lib/types";
import { ScaleTime, ScaleLinear } from "d3-scale";
import defaults from "./defaults";
import css from "./styles.less";

interface Props {
  timeSeries: TimeSeries;
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  stroke?: string;
}

const Timeline: React.StatelessComponent<Props> = ({
  timeSeries,
  xScale,
  stroke,
  yScale
}) => {
  const pathString = timeSeries
    .map(([timestamp, val]) => ({
      x: xScale(timestamp),
      y: yScale(val)
    }))
    .map(({ x, y }, i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`))
    .join(" ");
  return (
    <path
      d={pathString}
      className={css.timeLine}
      stroke={stroke || defaults.STROKE_COLOR}
    />
  );
};

export default Timeline;
