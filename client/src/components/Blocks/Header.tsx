import React from "react";
import css from "./styles.less";

const Row: React.StatelessComponent = ({ children }) => (
  <div className={css.header}>{children}</div>
);

export default Row;
