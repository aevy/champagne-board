import React from "react";
import css from "./styles.less";
import classNames from "classnames";

interface Props {
  className?: string;
}

const Row: React.StatelessComponent<Props> = ({ children, className }) => (
  <div className={classNames(css.row, className)}>{children}</div>
);

export default Row;
