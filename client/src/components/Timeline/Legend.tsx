import React from "react";
import { TimelionResult } from "Lib/types";

interface Props {
  timelionResult: TimelionResult;
  labelFunction?: (timelionResult: TimelionResult) => string;
  color: string;
  x: number;
  y: number;
}

const Legend: React.StatelessComponent<Props> = ({
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
    <text x={x} y={y} fill={color}>
      {label}
    </text>
  );
};

export default Legend;
