import React from "react";
import { Modal, Button, Input, Form, Message, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import _ from "lodash";
// import { maxGroupNum, getProjectGroupDefault } from 'constants/Projects';
import ManageBaseBase from "./ManageBarBase";
// import { actions } from '../actions';

class RenderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newNameInputValue: "",
      isOpen: false,
      errors: []
    };
  }
  handleRef = c => {
    this.inputRef = c;
  };

  focus = () => {
    setTimeout(() => {
      if (this.inputRef) {
        this.inputRef.focus();
      }
    }, 0);
  };
  clearNewName = () => {
    this.setState({ newNameInputValue: "" });
  };
  closeModal = () => {
    this.setState({ isOpen: false });
  };
  openModal = () => {
    this.setState({ isOpen: true });
  };
  delayClearErrors = () => {
    setTimeout(() => {
      this.setState({ errors: [] });
    }, 2000);
  };
  render() {
    const { renderTrigger, closeIcon = false } = this.props;
    const { newNameInputValue, errors = [], isOpen = false } = this.state;
    return (
      <Modal
        size={"mini"}
        open={isOpen}
        onOpen={() => {
          this.setState({
            newNameInputValue: ""
          });
          this.focus();
        }}
        trigger={renderTrigger({
          openModal: this.openModal
        })}
      >
        {closeIcon && (
          <Icon
            name={"close"}
            className={"close"}
            onClick={() => {
              this.closeModal();
            }}
          />
        )}
        <Modal.Header>Header</Modal.Header>
        <Modal.Content>
          {errors.length > 0 && (
            <Message
              error
              header="There was some errors with your submission"
              list={errors.map(error => error)}
            />
          )}
          <Form
            id="myform"
            onSubmit={() => {
              const groups = _.get(this.props.project, "groups", []);
              const name = this.state.newNameInputValue;
            }}
          >
            <Form.Field>
              <Input
                placeholder="type....."
                pattern=".*\S+.*"
                value={newNameInputValue}
                onChange={(e, { value }) => {
                  this.setState({ newNameInputValue: value });
                }}
                ref={this.handleRef}
                required
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <ManageBaseBase.SaveButton form="myform">
            Save
          </ManageBaseBase.SaveButton>
          <ManageBaseBase.CancelButton onClick={this.closeModal}>
            No
          </ManageBaseBase.CancelButton>
        </Modal.Actions>
      </Modal>
    );
  }
}
RenderModal.propTypes = {
  renderTrigger: PropTypes.func.isRequired,
  closeIcon: PropTypes.bool
};

export default RenderModal;

export const Usage = () => (
  <RenderModal
    closeIcon
    renderTrigger={({ openModal }) => (
      <div
        onClick={() => {
          openModal();
        }}
      >
        <Icon name="edit" />I can customize the modal trigger
      </div>
    )}
  />
);
