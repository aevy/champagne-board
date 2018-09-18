import React from "react";
import { HashRouter as Router } from "react-router-dom";
import { History } from "history";
import createHistory from "history/createBrowserHistory";
import { Provider } from "react-redux";
import store from "Redux/store";
import Boards from "Components/Boards/Boards";

class AppRoot extends React.PureComponent<{}, {}> {
  history: History;
  constructor(props: any) {
    super(props);
    this.history = createHistory();
    this.setState = () => null;
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div style={{ height: "100%" }}>
            <Boards />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default AppRoot;
