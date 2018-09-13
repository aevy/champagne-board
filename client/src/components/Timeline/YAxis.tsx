import React from "react";
import css from "./styles.less";
import { ScaleLinear } from "d3";
import _ from "lodash";
import classNames from "classnames";
import defaults from "Components/Timeline/defaults";

export type YAxisTickType =
  | { type: "stepSize"; stepSize: number }
  | { type: "totalSteps"; steps: number }
  | { type: "function"; fn: (scale: ScaleLinear<number, number>) => number[] };

interface Props {
  scale: ScaleLinear<number, number>;
  tickType: YAxisTickType;
  x1: number;
  x2: number;
}

const getTicks = (
  ticks: YAxisTickType,
  scale: ScaleLinear<number, number>
): number[] => {
  if (ticks.type === "function") {
    return ticks.fn(scale);
  } else if (ticks.type === "totalSteps") {
    const [min, max] = scale.domain();
    const diff = max - min;
    const stepSize = diff / ticks.steps;
    return _.range(min, max + 1, stepSize);
  } else if (ticks.type === "stepSize") {
    const [min, max] = scale.domain();
    return _.range(min, max + 1, ticks.stepSize);
  }
};

export default class YAxis extends React.Component<Props> {
  render() {
    const { tickType, scale, x1, x2 } = this.props;
    const ticks = getTicks(tickType, scale);
    const lines = ticks.map(t => {
      const y = scale(t);
      return (
        <g key={y} className={classNames(css.grid, css.yGrid)}>
          <line x1={x1} x2={x2} y1={y} y2={y} />
          <text
            x={x1 + defaults.Y_AXIS_LABEL_OFFSET_PX_X}
            y={y + defaults.Y_AXIS_LABEL_OFFSET_PX_Y}>
            {t}
          </text>
        </g>
      );
    });
    return <g>{...lines}</g>;
  }
}
