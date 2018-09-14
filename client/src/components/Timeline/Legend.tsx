import React from "react";
import { TimelionResult } from "Lib/types";
import css from "./styles.less";
import classNames from "classnames";

interface Props {
  selected: boolean;
  timelionResult: TimelionResult;
  labelFunction?: (timelionResult: TimelionResult) => string;
  onClick: () => void;
  color: string;
  x: number;
  y: number;
}

const Legend: React.StatelessComponent<Props> = ({
  onClick,
  selected,
  timelionResult,
  labelFunction,
  color,
  x,
  y
}) => {
  const label = !!labelFunction
    ? labelFunction(timelionResult)
    : timelionResult.split || timelionResult.label;
  return (
    <text
      x={x}
      y={y}
      fill={color}
      onClick={onClick}
      className={classNames(css.legend, { [css.selected]: selected })}>
      {label}
    </text>
  );
};

export default Legend;
