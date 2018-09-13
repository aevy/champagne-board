import React, { ChangeEvent } from "react";

interface Props {
  className?: string;
  value: number;
  onChange: (newVal: number) => any;
}

const numRegex = new RegExp("\\d+");

export default class NumberInput extends React.PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (numRegex.test(value)) {
      this.props.onChange(Number.parseInt(value));
    } else if (value === "") {
      this.props.onChange(0);
    }
  }

  render() {
    return (
      <input
        className={this.props.className}
        onChange={this.handleInput}
        value={this.props.value}
      />
    );
  }
}
