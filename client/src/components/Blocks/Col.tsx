import React from "react";
import css from "./styles.less";
import classNames from "classnames";

interface Props
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {
  flex?: number;
}

const Row: React.StatelessComponent<Props> = ({ children, flex, ...props }) => (
  <div
    className={classNames(css.col, props.className)}
    style={!!flex ? { flexGrow: flex, ...props.style } : props.style}
    {...props}>
    {children}
  </div>
);

export default Row;
