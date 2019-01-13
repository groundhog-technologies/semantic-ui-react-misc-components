import React from "react";
import ReactDom from "react-dom";
import PropTypes from "prop-types";

class SimplePortal extends React.Component {
  constructor(props) {
    super(props);
    this.div = document.createElement("div");
  }
  componentDidMount = () => {
    document.getElementById(this.props.mountNodeId).appendChild(this.div);
  };
  componentWillUnmount = () => {
    document.getElementById(this.props.mountNodeId).removeChild(this.div);
  };

  render() {
    return ReactDom.createPortal(this.props.children || null, this.div);
  }
}
SimplePortal.propTypes = {
  mountNodeId: PropTypes.string.isRequired
};

export const Usage = class Usage extends React.Component {
  render() {
    return (
      <div>
        <div id="portalUsageId">
          <pre>portalUsageId</pre>
        </div>
        <SimplePortal mountNodeId="portalUsageId">QQQQ</SimplePortal>
      </div>
    );
  }
};
export default SimplePortal;
