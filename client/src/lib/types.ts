import QueryBuilder from "Lib/queryBuilder";

export type SeriesFit = "nearest";

export type TimeSeries = DataPoint[];
export type DataPoint = [number, number];

export interface TimeQuery {
  from: string;
  interval: string;
  mode: string;
  timezone: string;
  to: string;
}

export interface User {
  name: string;
  id: string;
  delivery?: boolean;
  sales?: boolean;
}

export interface TimelionResult {
  data: TimeSeries;
  fit: SeriesFit;
  label: string;
  split?: string;
}

export type LabelFunction = (series: TimelionResult) => string;
export type FormatFunction = (series: TimelionResult) => any;

export interface Goal {
  label: string;
  query: QueryBuilder;
  time: TimeQuery;
  value: number;
  points?: number;
}

export interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface Option<T> {
  label: string;
  value: T;
}

export type TimeUnit = "day" | "week" | "month" | "year";

export interface ActionQuery {
  action: "string";
  label: "string";
  shortLabel: "string";
  goal: Goal;
}
