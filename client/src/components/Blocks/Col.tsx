import React from "react";
import css from "./styles.less";

interface Props {
  flex?: number;
}

const Row: React.StatelessComponent<Props> = ({ children, flex }) => (
  <div className={css.col} style={!!flex ? { flexGrow: flex } : {}}>
    {children}
  </div>
);

export default Row;
