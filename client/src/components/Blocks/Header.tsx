import React, { DOMAttributes } from "react";
import css from "./styles.less";

interface Props extends DOMAttributes<HTMLSpanElement> {
  className?: string;
}

const Row: React.StatelessComponent<Props> = ({ children, ...props }) => (
  <div className={css.header} {...props}>
    {children}
  </div>
);

export default Row;
