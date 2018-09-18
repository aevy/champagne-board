import React from "react";
import Board from "./Board";
import { getUsersForDomain } from "Lib/users";
import goals from "Lib/goals";

interface LocalState {
  domainIndex: number;
  autoplay: boolean;
}

interface Props {}

type Domain = "Sales" | "Delivery";

const TOGGLE_ORDER: Domain[] = ["Sales", "Delivery"];

const ACTION_QUERIES = {
  Sales: [
    {
      action: "NewCase",
      shortLabel: "Cases",
      label: "New cases by user",
      goal: goals.weeklyNewCases
    },
    {
      action: "Meeting",
      shortLabel: "Meetings",
      label: "Qualified meetings by user",
      goal: goals.weeklyMeetings
    },
    {
      action: "SentContract",
      shortLabel: "Sent",
      label: "Sent contracts by user",
      goal: goals.weeklySentContracts
    },
    {
      action: "SignedContract",
      shortLabel: "Signed",
      label: "Signed contracts by user",
      goal: goals.weeklySignedContracts
    }
  ],
  Delivery: [
    {
      action: "accepted",
      shortLabel: "Accepts",
      label: "Accepted candidates by user",
      goal: goals.weeklyAccepts
    },
    {
      action: "presented",
      shortLabel: "Presents",
      label: "Presented candidates by user",
      goal: goals.weeklyPresents
    }
  ]
};

class Boards extends React.PureComponent<Props, LocalState> {
  constructor(props: Props) {
    super(props);
    this.getUsers = this.getUsers.bind(this);
    this.nextBoard = this.nextBoard.bind(this);
    this.toggleAutoplay = this.toggleAutoplay.bind(this);
    this.getDomain = this.getDomain.bind(this);
    (this as any).state = {
      autoplay: false,
      domainIndex: 0
    };
  }

  componentDidMount() {
    (this as any).poll = window.setInterval(() => {
      if (this.state.autoplay) {
        this.nextBoard();
      }
    }, 10 * 1000);
  }

  componentWillUnmount() {
    window.clearInterval((this as any).poll);
  }

  getUsers() {
    return getUsersForDomain(this.getDomain());
  }

  getDomain() {
    return TOGGLE_ORDER[this.state.domainIndex];
  }

  nextBoard() {
    const nextIndex = (this.state.domainIndex + 1) % TOGGLE_ORDER.length;
    this.setState({ domainIndex: nextIndex });
  }

  toggleAutoplay() {
    const { autoplay } = this.state;
    this.setState({ autoplay: !autoplay });
  }

  render() {
    const { autoplay } = this.state;
    const users = this.getUsers();
    const domain = this.getDomain();
    const actionQueries = ACTION_QUERIES[domain];
    return (
      <Board
        domain={domain}
        users={users}
        autoplay={autoplay}
        actionQueries={actionQueries}
        nextBoard={this.nextBoard}
        toggleAutoplay={this.toggleAutoplay}
      />
    );
  }
}

export default Boards;
