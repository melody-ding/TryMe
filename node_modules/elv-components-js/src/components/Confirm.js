import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import PropTypes from "prop-types";
import Form from "./Form";
import Modal from "./Modal";

class ConfirmModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: {
        loading: false,
        completed: false,
        error: false,
        errorMessage: ""
      }
    };

    this.HandleCancel = this.HandleCancel.bind(this);
    this.HandleConfirm = this.HandleConfirm.bind(this);
  }

  async Action(action) {
    this.setState({status: {loading: true, completed: false, error: false}});

    try {
      await action();
    } catch(error) {
      this.setState({status: {loading: false, completed: false, error: true, errorMessage: error.message}});
    }
  }

  async HandleConfirm() {
    if(this.props.onConfirm) {
      await this.Action(this.props.onConfirm);
    }
  }

  async HandleCancel() {
    if(this.props.onCancel) {
      await this.Action(this.props.onCancel);
    }
  }

  render() {
    return (
      <Modal closable={true} OnClickOutside={this.HandleCancel}>
        <Form
          submitText="OK"
          legend="Confirm"
          status={this.state.status}
          formContent={<p>{this.props.message}</p>}
          OnSubmit={this.HandleConfirm}
          OnCancel={this.HandleCancel}
        />
      </Modal>
    );
  }
}

ConfirmModal.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired
};

const Confirm = async ({message, onConfirm, onCancel}) => {
  return await new Promise(resolve => {
    const targetId = "-elv-confirm-target";

    const RemoveModal = () => {
      const target = document.getElementById(targetId);
      unmountComponentAtNode(target);
      target.parentNode.removeChild(target);
    };

    const HandleConfirm = async () => {
      if (onConfirm) {
        await onConfirm();
      }

      RemoveModal();

      resolve(true);
    };

    const HandleCancel = async () => {
      try {
        if (onCancel) {
          await onCancel();
        }
      } finally {
        RemoveModal();

        resolve(false);
      }
    };

    const target = document.createElement("div");
    target.id = targetId;
    document.body.appendChild(target);

    render(
      <ConfirmModal message={message} onConfirm={HandleConfirm} onCancel={HandleCancel}/>,
      target
    );
  });
};

export default Confirm;
