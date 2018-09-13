import React, { MouseEvent } from "react";
import css from "./styles.less";

interface Props {
  isOpen: boolean;
  close: () => void;
}

const stopClickPropagation = (e: MouseEvent<HTMLElement>) => {
  e.stopPropagation();
};

const Modal: React.StatelessComponent<Props> = ({ isOpen, close, children }) =>
  isOpen ? (
    <div onClick={close} className={css.modalBackdrop}>
      <div className={css.modal} onClick={stopClickPropagation}>
        {children}
      </div>
    </div>
  ) : null;

export default Modal;
