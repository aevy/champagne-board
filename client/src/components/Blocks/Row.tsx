import React from "react";
import css from "./styles.less";
import classNames from "classnames";

interface Props {
  flex?: number;
  className?: string;
}

const Row: React.StatelessComponent<Props> = ({
  children,
  className,
  flex
}) => (
  <div
    className={classNames(css.row, className)}
    style={!!flex ? { flexGrow: flex } : {}}>
    {children}
  </div>
);

export default Row;
