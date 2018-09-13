import React from "react";
import { TimeQuery } from "Lib/types";
import { QueryCache } from "Redux/reducers/queryCache";
import { getLastCachedValues } from "Lib/timelionCache";
import { withQueryCache } from "HOC/withQueryCache";
import QueryBuilder from "Lib/queryBuilder";

const DEFAULT_DISPLAY_VALUE = "-";

interface Props {
  query: QueryBuilder;
  timeQuery: TimeQuery;
  interval: number;
}

interface LocalState {
  ping: number;
}

interface ReduxDispatchProps {
  timelionQuery: (query: QueryBuilder, time: TimeQuery, stale: number) => any;
}

interface ReduxStateProps {
  queryCache: QueryCache;
}

type ViewProps = Props & ReduxDispatchProps & ReduxStateProps;

const getValueOrDefault = (
  query: QueryBuilder,
  timeQuery: TimeQuery,
  cachedQueries: QueryCache
) =>
  getLastCachedValues(query, timeQuery, cachedQueries)
    .map(values => values[0])
    .map(value => value.toString())
    .valueOr(DEFAULT_DISPLAY_VALUE);

export class Counter extends React.PureComponent<ViewProps, LocalState> {
  constructor(props: ViewProps) {
    super(props);
    this.state = { ping: null };
  }
  componentDidMount() {
    const { interval } = this.props;
    const ping = window.setInterval(() => {
      const { query, timeQuery, timelionQuery } = this.props;
      timelionQuery(query, timeQuery, interval);
    }, interval);
    this.setState({ ping });
  }
  componentWillUnmount() {
    clearInterval(this.state.ping);
  }

  render() {
    const { query, timeQuery, queryCache } = this.props;
    const latestValue = getValueOrDefault(query, timeQuery, queryCache);
    return <span>{latestValue}</span>;
  }
}

export default withQueryCache(Counter);
