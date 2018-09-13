import React from "react";
import { Option } from "Lib/types";
import css from "./styles.less";
import classNames from "classnames";

interface Props<T> {
  availableOptions: Option<T>[];
  onSelect: (value: T) => any;
  selectedValue: T;
  getKey?: (value: T) => string | number;
  className?: string;
}

class OptionSelector<T> extends React.PureComponent<Props<T>> {
  render() {
    const {
      availableOptions,
      onSelect,
      getKey,
      selectedValue,
      className
    } = this.props;
    return (
      <div className={classNames(css.options, className)}>
        {availableOptions.map(option => (
          <div
            onClick={() => onSelect(option.value)}
            className={classNames(css.option, {
              [css.selected]: !!getKey
                ? getKey(option.value) === getKey(selectedValue)
                : option.value === selectedValue
            })}>
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default OptionSelector;
