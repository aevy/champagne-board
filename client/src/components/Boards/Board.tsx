import React from "react";
import {
  Grid,
  Col,
  Row,
  Cell,
  Header,
  Modal,
  Subheader
} from "Components/Blocks";
import {
  User,
  TimeQuery,
  TimelionResult,
  TimeUnit,
  ActionQuery
} from "Lib/types";
import Counter from "Components/Counter";
import GoalItem from "Components/GoalItem";
import withDateSelector, { DateRange } from "HOC/withDateSelector";
import TimeQuerySelector from "Components/Boards/TimeQuerySelector";
import css from "./styles.less";
import TimelineGraph from "Components/Timeline";
import { withQueryCache } from "HOC/withQueryCache";
import { QueryCache } from "Redux/reducers/queryCache";
import { getChachedValue, getCacheKey } from "Lib/timelionCache";
import QB from "Lib/queryBuilder";
import QueryBuilder from "Lib/queryBuilder";
import ChampagneList from "Components/ChampagneList";
import { thisWeekDayInterval, thisMonthDayInterval } from "Lib/timeQueries";

const NO_OF_HIRES_QUERY = QB.create()
  .query({ action: "hire" })
  .cummulative();
const SUM_OF_HIRES_QUERY = QB.create()
  .query({ action: "hire" })
  .metric("sum", ["payload", "amount"])
  .cummulative();

const userTable = (
  user: User,
  domain: string,
  selectChartQuery: (q: QueryBuilder, chartHeader: string) => void,
  actionQueries: ActionQuery[],
  pollFrequency: number
) => {
  const statsForUser = QB.create()
    .query({ userId: user.id, story: domain })
    .split("action")
    .cummulative();

  const userQueries = actionQueries.map(ac =>
    QB.create()
      .query({ userId: user.id, action: ac.action })
      .cummulative()
  );

  return (
    <Col>
      <Cell onClick={() => selectChartQuery(statsForUser, user.name)}>
        <Subheader>{user.name}</Subheader>
      </Cell>
      {userQueries.map(query => (
        <Cell>
          <Header>
            <Counter
              query={query}
              timeQuery={thisWeekDayInterval}
              interval={pollFrequency * 1000}
            />
          </Header>
        </Cell>
      ))}
    </Col>
  );
};

interface Props {
  domain: string;
  users: User[];
  actionQueries: ActionQuery[];
  nextBoard: () => void;
  toggleAutoplay: () => void;
  autoplay: boolean;
}

interface ViewProps extends Props {
  selectedDateRange: DateRange;
  selectedDateInterval: TimeUnit;
  selectDateRange: (dateRange: DateRange) => void;
  selectDateInterval: (dateInterval: TimeUnit) => void;
  selectedTimeQuery: TimeQuery;
  queryCache: QueryCache;
  timelionQuery: (
    query: QueryBuilder,
    time: TimeQuery,
    stale: number
  ) => Promise<TimelionResult>;
}

interface LocalState {
  pollFrequency: number;
  chartHeader: string;
  modalIsOpen: boolean;
  chartCummulative: boolean;
  chartQuery: QueryBuilder;
}

class Board extends React.PureComponent<ViewProps, LocalState> {
  constructor(props: ViewProps) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.setChartQuery = this.setChartQuery.bind(this);
    this.setChartCummulative = this.setChartCummulative.bind(this);
    this.setPollFrequency = this.setPollFrequency.bind(this);
    this.getDefaultQuery = this.getDefaultQuery.bind(this);
    this.updateAllUserStats = this.updateAllUserStats.bind(this);

    (this.state as any) = {
      pollFrequency: 30,
      chartHeader: props.domain,
      modalIsOpen: false,
      chartCummulative: true,
      chartQuery: this.getDefaultQuery()
    };
  }

  componentDidMount() {
    this.updateAllUserStats();
    const { timelionQuery } = this.props;
    timelionQuery(NO_OF_HIRES_QUERY, thisMonthDayInterval, 0);
    timelionQuery(SUM_OF_HIRES_QUERY, thisMonthDayInterval, 0);
    (this as any).poll = window.setInterval(() => {
      const { selectedTimeQuery } = this.props;
      const { chartQuery, chartCummulative, pollFrequency } = this.state;
      timelionQuery(
        chartQuery.cummulative(chartCummulative),
        selectedTimeQuery,
        pollFrequency * 1000
      );
    }, 5 * 1000);
  }

  componentDidUpdate(p: ViewProps, s: LocalState) {
    const { selectedTimeQuery, timelionQuery, domain } = this.props;
    const { chartQuery, chartCummulative } = this.state;
    const shouldRequery =
      getCacheKey(
        chartQuery.cummulative(chartCummulative),
        selectedTimeQuery
      ) !==
      getCacheKey(
        s.chartQuery.cummulative(s.chartCummulative),
        p.selectedTimeQuery
      );
    if (domain !== p.domain) {
      this.updateAllUserStats();
      this.setState({
        chartQuery: this.getDefaultQuery(),
        chartHeader: domain
      });
    } else if (shouldRequery) {
      timelionQuery(
        chartQuery.cummulative(chartCummulative),
        selectedTimeQuery,
        0
      );
    }
  }

  getDefaultQuery() {
    return QB.create()
      .query({ story: this.props.domain })
      .split("action")
      .cummulative();
  }

  updateAllUserStats() {
    const { timelionQuery, actionQueries, users } = this.props;
    actionQueries.forEach(({ action, goal }) => {
      users.forEach(user => {
        const query = QB.create()
          .query({ action, userId: user.id })
          .cummulative();
        timelionQuery(query, thisWeekDayInterval, 0);
      });
      timelionQuery(goal.query, goal.time, 0);
    });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }
  setChartQuery(chartQuery: QueryBuilder, chartHeader: string) {
    this.setState({ chartQuery, chartHeader });
  }
  setChartCummulative(chartCummulative: boolean) {
    this.setState({ chartCummulative });
  }
  setPollFrequency(pollFrequency: number) {
    this.setState({ pollFrequency });
  }

  render() {
    const {
      autoplay,
      toggleAutoplay,
      nextBoard,
      selectDateInterval,
      selectDateRange,
      selectedDateInterval,
      selectedTimeQuery,
      queryCache,
      domain,
      users,
      actionQueries,
      selectedDateRange
    } = this.props;

    const {
      pollFrequency,
      modalIsOpen,
      chartQuery,
      chartCummulative,
      chartHeader
    } = this.state;
    const timelionResults = getChachedValue(
      chartQuery.cummulative(chartCummulative),
      selectedTimeQuery,
      queryCache
    ).valueOr(null);
    return (
      <Grid>
        <Row>
          <Col flex={5}>
            <Row>
              <Col>
                <Cell blue>
                  <Subheader className={css.clickable} onClick={nextBoard}>
                    {domain}
                  </Subheader>
                  <span className={css.clickable} onClick={toggleAutoplay}>
                    Autotoggle is {autoplay ? "ON" : "OFF"}
                  </span>
                  <Modal isOpen={modalIsOpen} close={this.closeModal}>
                    <TimeQuerySelector
                      pollFrequency={pollFrequency}
                      setPollFrequency={this.setPollFrequency}
                      setChartCummulative={this.setChartCummulative}
                      chartCummulative={chartCummulative}
                      selectDateInterval={selectDateInterval}
                      selectDateRange={selectDateRange}
                      selectedDateInterval={selectedDateInterval}
                      selectedDateRange={selectedDateRange}
                      selectedTimeQuery={selectedTimeQuery}
                    />
                  </Modal>
                </Cell>
                {actionQueries.map(({ action, label, shortLabel }) => (
                  <Cell
                    onClick={() =>
                      this.setChartQuery(
                        QB.create()
                          .query({ action })
                          .split("user")
                          .cummulative(),
                        label
                      )
                    }>
                    <Subheader>{shortLabel}</Subheader>
                  </Cell>
                ))}
              </Col>
              {users.map(user =>
                userTable(
                  user,
                  domain,
                  this.setChartQuery,
                  actionQueries,
                  pollFrequency
                )
              )}
              <Col>
                <Cell
                  onClick={() =>
                    this.setChartQuery(this.getDefaultQuery(), `${domain}`)
                  }>
                  <Subheader>Total</Subheader>
                </Cell>
                {actionQueries.map(({ goal }) => (
                  <GoalItem goal={goal} />
                ))}
              </Col>
            </Row>
            <Row>
              <Cell className={css.darkCell}>
                <Header>
                  {chartHeader}{" "}
                  <span onClick={this.openModal} className={css.clickable}>
                    ⚙
                  </span>
                </Header>
                <TimelineGraph
                  timelionResults={timelionResults}
                  xTicks={selectedDateInterval}
                  yTicks={{ type: "totalSteps", steps: 4 }}
                  margin={{ top: 0, bottom: 40, left: 40, right: 120 }}
                />
              </Cell>
            </Row>
          </Col>
          <Col flex={2}>
            <ChampagneList />
            <Col>
              <Cell
                blue
                onClick={() =>
                  this.setChartQuery(NO_OF_HIRES_QUERY, "Number of hires")
                }>
                <Subheader># of Hires</Subheader>
                <Header>
                  <Counter
                    query={NO_OF_HIRES_QUERY}
                    timeQuery={thisMonthDayInterval}
                    interval={pollFrequency * 1000}
                  />
                </Header>
                <Subheader>this month</Subheader>
              </Cell>
              <Cell
                blue
                onClick={() =>
                  this.setChartQuery(SUM_OF_HIRES_QUERY, "Hires worth")
                }>
                <Subheader>Hire sales</Subheader>
                <Header>
                  <Counter
                    query={SUM_OF_HIRES_QUERY}
                    timeQuery={thisMonthDayInterval}
                    interval={pollFrequency * 1000}
                  />
                </Header>
                <Subheader>USD this month</Subheader>
              </Cell>
            </Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withQueryCache(withDateSelector<Props, {}>(Board));
