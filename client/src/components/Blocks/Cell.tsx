import React from "react";
import css from "./styles.less";
import classNames from "classnames";

interface Props {
  green?: boolean;
  blue?: boolean;
  orange?: boolean;
  onClick?: () => void;
  className?: string;
}

const Cell: React.StatelessComponent<Props> = ({
  children,
  blue,
  orange,
  green,
  className,
  ...props
}) => (
  <div
    className={classNames(css.cell, className, {
      [css.green]: green,
      [css.blue]: blue,
      [css.orange]: orange,
      [css.clickable]: !!props.onClick
    })}
    {...props}>
    {children}
  </div>
);

export default Cell;
