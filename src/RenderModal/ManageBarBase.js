import React from "react";
import PropTypes from "prop-types";
import { Button, Icon, Input } from "semantic-ui-react";
import LazyInput from "../LazyInput.js";

class ManageBarBase extends React.Component {
  static SearchBar = ({ children, ...props }) => (
    <LazyInput
      style={{ width: "250px", marginLeft: "20px" }}
      as={Input}
      icon="search"
      iconPosition="left"
      placeholder={`Search.....`}
      {...props}
    />
  );
  static SaveButton = ({ children, ...props }) => (
    <Button
      icon
      labelPosition="left"
      positive
      style={{ width: "200px" }}
      {...props}
    >
      <Icon name="save" />
      {children}
    </Button>
  );
  static DeleteButton = ({ children, ...props }) => {
    return (
      <ManageBarBase.SaveButton {...props} negative>
        {children}
      </ManageBarBase.SaveButton>
    );
  };
  static AddButton = ({ children, ...props }) => (
    <Button
      icon
      labelPosition="left"
      positive
      style={{ width: "200px" }}
      {...props}
    >
      <Icon name="add" />
      {children}
    </Button>
  );

  static CancelButton = ({ children, ...props }) => (
    <Button icon labelPosition="left" {...props}>
      <Icon name="close" />
      {children}
    </Button>
  );
}

ManageBarBase.propTypes = {
  title: PropTypes.string,
  titleRender: PropTypes.func
};
export default ManageBarBase;
