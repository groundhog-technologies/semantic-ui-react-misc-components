import React from "react";
import debounce from "lodash/debounce";
import PropTypes from "prop-types";
import { Input } from "semantic-ui-react";

class LazyInput extends React.Component {
  constructor(props) {
    super(props);
    const { time = 200, value } = props;
    this.state = { value: value || "" };
    this.onChange = debounce(this.onChange, time).bind(this);
  }
  componentWillReceiveProps({ value }) {
    this.setState({ value });
  }
  shouldComponentUpdate(nextProps, { value }) {
    if (value !== this.state.value) {
      return true;
    }
    return false;
  }
  onChange() {
    this.props.onChange(this.state.value);
  }
  componentDidUpdate() {
    this.onChange();
  }
  render() {
    const { as, time, value, onChange, ...restProps } = this.props;
    return as ? (
      React.createElement(as, {
        value: this.state.value,
        // onChange for semantic Input
        onChange: (e, { value }) => {
          this.setState({ value });
        },
        ...restProps
      })
    ) : (
      <input
        value={this.state.value}
        type="text"
        onChange={e => {
          this.setState({ value: e.target.value });
        }}
        {...restProps}
      />
    );
  }
}

LazyInput.propTypes = {
  as: PropTypes.func, // expecting semantic-ui-rect Input
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
LazyInput.defaultProps = { value: "" };
export default LazyInput;

export const Usage = class Usage extends React.Component {
  state = {
    keyword: ""
  };
  render() {
    return (
      <LazyInput
        value={this.state.keyword}
        onChange={() => {
          console.log("LazyInput onChange only update every 1000ms");
        }}
        placeholder={"type and check console"}
        time={1000}
      />
    );
  }
};

export const Usage2 = class Usage2 extends React.Component {
  state = {
    keyword: ""
  };
  render() {
    return (
      <LazyInput
        as={Input}
        value={this.state.keyword}
        onChange={value => {
          this.setState({ keyword: value });
          console.log("LazyInput onChange only update every 1000ms");
        }}
        placeholder={"semantic-ui Input type and check console"}
        time={1000}
      />
    );
  }
};
