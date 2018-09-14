import React, { DOMAttributes } from "react";
import css from "./styles.less";
import classNames from "classnames";

interface Props extends DOMAttributes<HTMLSpanElement> {
  className?: string;
}

const Subheader: React.StatelessComponent<Props> = (props) => 
  <span {...props} className={classNames(css.subheader, props.className)}>{props.children}</span>

export default Subheader;