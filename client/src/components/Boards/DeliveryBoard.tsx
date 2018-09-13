import React from "react";
import { Grid, Col, Row, Cell, Header, Modal } from "Components/Blocks";
import { deliveryUsers } from "Lib/users";
import { User, TimeQuery, TimelionResult, TimeUnit } from "Lib/types";
import Counter from "Components/Counter";
import GoalItem from "Components/GoalItem";
import goals from "Lib/goals";
import withDateSelector, { DateRange } from "HOC/withDateSelector";
import TimeQuerySelector from "Components/Boards/TimeQuerySelector";
import css from "./styles.less";
import TimelineGraph from "Components/Timeline";
import { withQueryCache } from "HOC/withQueryCache";
import { QueryCache } from "Redux/reducers/queryCache";
import { getChachedValue } from "Lib/timelionCache";
import QB from "Lib/queryBuilder";
import QueryBuilder from "Lib/queryBuilder";

const DEFAULT_QUERY = QB.create()
  .query({ story: "Delivery" })
  .split("action")
  .cummulative();

const ALL_PRESENTS_QUERY = QB.create()
  .query({ action: "presented" })
  .split("user")
  .cummulative();

const ALL_ACCEPTS_QUERY = QB.create()
  .query({ action: "accepted" })
  .split("user")
  .cummulative();

const NO_OF_HIRES_QUERY = QB.create()
  .query({ action: "hire" })
  .cummulative();
const SUM_OF_HIRES_QUERY = QB.create()
  .query({ action: "hire" })
  .metric("sum", ["payload", "amount"])
  .cummulative();

const deliveryUserTable = (
  user: User,
  timeQuery: TimeQuery,
  selectChartQuery: (q: QueryBuilder, chartHeader: string) => void,
  pollFrequency: number
) => {
  const acceptsQuery = QB.create()
    .query({ userId: user.id, action: "accepted" })
    .cummulative();
  const presentsQuery = QB.create()
    .query({ userId: user.id, action: "presented" })
    .cummulative();
  const statsForUser = QB.create()
    .query({ userId: user.id })
    .split("action")
    .cummulative();
  return (
    <Col>
      <Cell onClick={() => selectChartQuery(statsForUser, user.name)}>
        <Header>{user.name}</Header>
      </Cell>
      <Cell>
        <Header>
          <Counter
            query={presentsQuery}
            timeQuery={timeQuery}
            interval={pollFrequency * 1000}
          />
        </Header>
      </Cell>
      <Cell>
        <Header>
          <Counter
            query={acceptsQuery}
            timeQuery={timeQuery}
            interval={pollFrequency * 1000}
          />
        </Header>
      </Cell>
    </Col>
  );
};

interface Props {}

interface ViewProps {
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

class DeliveryBoard extends React.PureComponent<ViewProps, LocalState> {
  constructor(props: ViewProps) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.setChartQuery = this.setChartQuery.bind(this);
    this.setChartCummulative = this.setChartCummulative.bind(this);
    this.setPollFrequency = this.setPollFrequency.bind(this);

    (this.state as any) = {
      pollFrequency: 30,
      chartHeader: "All delivery",
      modalIsOpen: false,
      chartCummulative: true,
      chartQuery: DEFAULT_QUERY
    };
  }

  componentDidMount() {
    (this as any).poll = window.setInterval(() => {
      const { timelionQuery, selectedTimeQuery } = this.props;
      const { chartQuery, chartCummulative, pollFrequency } = this.state;
      timelionQuery(
        chartQuery.cummulative(chartCummulative),
        selectedTimeQuery,
        pollFrequency * 1000
      );
    }, 5 * 1000);
  }

  componentDidUpdate(p: ViewProps, s: LocalState) {
    const { selectedTimeQuery } = this.props;
    const { chartQuery, chartCummulative } = this.state;
    const shouldRequery =
      JSON.stringify(p.selectedTimeQuery) !==
        JSON.stringify(selectedTimeQuery) ||
      chartQuery.build() !== s.chartQuery.build() ||
      chartCummulative !== s.chartCummulative;
    if (shouldRequery) {
      p.timelionQuery(
        s.chartQuery.cummulative(s.chartCummulative),
        p.selectedTimeQuery,
        0
      );
    }
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
      selectDateInterval,
      selectDateRange,
      selectedDateInterval,
      selectedTimeQuery,
      queryCache,
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
    ).valueOr([]);
    return (
      <Grid>
        <Row>
          <Col flex={5}>
            <Row>
              <Col>
                <Cell blue>
                  <span>Delivery</span>
                  <span className={css.clickable} onClick={this.openModal}>
                    {selectedDateRange.label}
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
                <Cell
                  onClick={() =>
                    this.setChartQuery(
                      ALL_PRESENTS_QUERY,
                      "Presentations by user"
                    )
                  }>
                  <Header>Presents</Header>
                </Cell>
                <Cell
                  onClick={() =>
                    this.setChartQuery(ALL_ACCEPTS_QUERY, "Accepts by user")
                  }>
                  <Header>Accepts</Header>
                </Cell>
              </Col>
              {deliveryUsers.map(user =>
                deliveryUserTable(
                  user,
                  selectedTimeQuery,
                  this.setChartQuery,
                  pollFrequency
                )
              )}
              <Col>
                <Cell
                  onClick={() =>
                    this.setChartQuery(DEFAULT_QUERY, "All delivery")
                  }>
                  <Header>Total</Header>
                </Cell>
                <GoalItem
                  goal={{ ...goals.weeklyPresents, time: selectedTimeQuery }}
                />
                <GoalItem
                  goal={{ ...goals.weeklyAccepts, time: selectedTimeQuery }}
                />
              </Col>
            </Row>
            <Row>
              <Cell className={css.darkCell}>
                <Header>{chartHeader}</Header>
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
            <Col>
              <Cell orange>CP</Cell>
            </Col>
            <Col>
              <Cell
                blue
                onClick={() =>
                  this.setChartQuery(NO_OF_HIRES_QUERY, "Number of hires")
                }>
                <Header># of Hires</Header>
                <Header>
                  <Counter
                    query={NO_OF_HIRES_QUERY}
                    timeQuery={selectedTimeQuery}
                    interval={pollFrequency * 1000}
                  />
                </Header>
              </Cell>
              <Cell
                blue
                onClick={() =>
                  this.setChartQuery(SUM_OF_HIRES_QUERY, "Hires worth")
                }>
                <Header>Hire$</Header>
                <Header>
                  <Counter
                    query={SUM_OF_HIRES_QUERY}
                    timeQuery={selectedTimeQuery}
                    interval={pollFrequency * 1000}
                  />
                  USD
                </Header>
              </Cell>
            </Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withQueryCache(withDateSelector<Props, {}>(DeliveryBoard));
