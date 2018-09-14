import React from "react";
import { Goal } from "Lib/types";
import { withQueryCache, WithQueryCache } from "HOC/withQueryCache";
import { Cell, Header, Col } from "Components/Blocks";
import { isGoalFulilled } from "Lib/goals";
import { getLastCachedValues } from "Lib/timelionCache";

const GOAL_POLL_INTERVAL = 5 * 1000;

interface Props {
  goal: Goal;
  disabled?: boolean;
}

interface LocalState {
  ping: number;
}

class GoalItem extends React.PureComponent<Props & WithQueryCache, LocalState> {
  componentDidMount() {
    const ping = window.setInterval(() => {
      const { goal, timelionQuery } = this.props;
      if (!!goal) {
        timelionQuery(goal.query, goal.time, GOAL_POLL_INTERVAL);
      }
    }, GOAL_POLL_INTERVAL);
    this.setState({ ping });
  }

  componentWillUnmount() {
    const { ping } = this.state;
    if (!!ping) {
      window.clearInterval(ping);
    }
  }

  render() {
    const { queryCache, goal, disabled } = this.props;
    const currentValue = getLastCachedValues(goal.query, goal.time, queryCache)
      .map(value => value.toString())
      .valueOr("-");
    const goalSatisfied = !disabled && isGoalFulilled(queryCache, goal);
    return (
      <Cell green={goalSatisfied}>
        <Col>
          <Header>
            {currentValue}/{goal.value}
          </Header>
        </Col>
      </Cell>
    );
  }
}

export default withQueryCache(GoalItem);
