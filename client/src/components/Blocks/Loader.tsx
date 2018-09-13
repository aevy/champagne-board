import React from "react";
import css from "./styles.less";

const TimelineLoading: React.StatelessComponent = () => (
  <div className={css.loader}>
    <img className={css.loader} src="assets/spinner.gif" />
  </div>
);

export default TimelineLoading;
