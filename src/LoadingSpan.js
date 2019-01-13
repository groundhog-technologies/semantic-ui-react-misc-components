import React from "react";
import PropTypes from "prop-types";
import { Loader } from "semantic-ui-react";

class LoadingSpan extends React.Component {
  state = {
    isLoading: false
  };

  setIsLoading = (bool = false) => {
    this.setState({ isLoading: bool });
  };
  render() {
    const { isLoading } = this.state;
    const { onSpanClick, loaderSize = "mini" } = this.props;
    return (
      <span
        onClick={() => {
          if (onSpanClick && !isLoading) {
            onSpanClick({ setIsLoading: this.setIsLoading });
          }
        }}
      >
        {this.props.children({
          isLoading,
          setIsLoading: this.setIsLoading,
          Loader: () =>
            isLoading ? <Loader size={loaderSize} active inline /> : null
        })}
      </span>
    );
  }
}
LoadingSpan.propTypes = {
  onSpanClick: PropTypes.func,
  loaderSize: PropTypes.string
};

export const Usage = () => (
  <LoadingSpan
    onSpanClick={({ setIsLoading }) => {
      console.log("loading for 3s");
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }}
  >
    {({ isLoading, setIsLoading, Loader }) => (
      <span>
        click me !! loader will change <Loader /> @@?
      </span>
    )}
  </LoadingSpan>
);

export default LoadingSpan;
