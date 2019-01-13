import React from "react";
import PropTypes from "prop-types";

class BlurOverlay extends React.Component {
  render() {
    const {
      children,
      isOn = false,
      isBlurOn = true,
      backgroundColor = "rgba(200,200,200,.2)"
    } = this.props;
    return (
      <div
        style={{ position: "relative" }}
        className={isOn && isBlurOn ? "svg-blur" : ""}
      >
        <style>
          {`
            .svg-blur { filter: url(#wherearemyglasses); }
          `}
        </style>

        <svg height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="wherearemyglasses" x="0" y="0">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            </filter>
          </defs>
        </svg>
        {this.props.isOn && (
          <div
            style={{
              position: "absolute",
              backgroundColor: backgroundColor,
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1000000
            }}
          />
        )}
        {children}
      </div>
    );
  }
}

BlurOverlay.propTypes = {
  isOn: PropTypes.bool.isRequired,
  isBlurOn: PropTypes.bool,
  backgroundColor: PropTypes.string
};
BlurOverlay.defaultProps = {
  isOn: false,
  isBlurOn: true,
  backgroundColor: "rgba(200,200,200,.2)"
};
export default BlurOverlay;

export const Usage = class Usage extends React.Component {
  state = {
    isOn: true
  };
  componentDidMount() {
    setInterval(() => {
      this.setState({ isOn: !this.state.isOn });
    }, 2000);
  }
  render() {
    return (
      <BlurOverlay isOn={this.state.isOn}>
        <div>something going to be BlurOverlayed.</div>
      </BlurOverlay>
    );
  }
};
