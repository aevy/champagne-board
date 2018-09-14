import React from "react";
import { Header, Cell, Subheader } from "Components/Blocks";
import { withQueryCache } from "HOC/withQueryCache";
import { QueryCache } from "Redux/reducers/queryCache";
import { TimeQuery, Goal } from "Lib/types";
import QueryBuilder from "Lib/queryBuilder";
import { goalList, isGoalFulilled } from "Lib/goals";
import _ from "lodash";

const MAX_CHAMPAGNE_POINTS = 6;

interface Props {
  queryCache: QueryCache;
  timelionQuery: (query: QueryBuilder, time: TimeQuery, stale: number) => any;
}

const renderGoal = (goal: Goal) => (
  <div>
    <span>{goal.label}</span>
    <span>+</span>
    <span>{goal.points || 1}</span>
  </div>
);

class ChampagneList extends React.Component<Props, {}> {
  componentDidMount() {
    const { timelionQuery } = this.props;
    (this as any).poll = window.setInterval(() => {
      goalList.map(goal => timelionQuery(goal.query, goal.time, 10 * 1000));
    }, 10 * 1000);
  }
  componentWillUnmount() {
    window.clearInterval((this as any).poll);
  }
  render() {
    const { queryCache } = this.props;
    const fulfilledGoals = goalList.filter(goal =>
      isGoalFulilled(queryCache, goal)
    );
    const totalPoints = _.chain(fulfilledGoals)
      .map(goal => goal.points || 1)
      .sum()
      .value();
    const champagneGoalReached = totalPoints >= MAX_CHAMPAGNE_POINTS;
    return (
      <Cell green={champagneGoalReached} orange={!champagneGoalReached}>
        <Header>
          {totalPoints}/{MAX_CHAMPAGNE_POINTS}
        </Header>
        <Subheader>Champagne Points</Subheader>
        <div>{fulfilledGoals.map(renderGoal)}</div>
      </Cell>
    );
  }
}

export default withQueryCache(ChampagneList);
