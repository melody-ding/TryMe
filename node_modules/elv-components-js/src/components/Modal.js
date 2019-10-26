import "../stylesheets/modals.scss";

import React from "react";
import PropTypes from "prop-types";

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      outsideContainerRef: React.createRef()
    };

    this.HandleClickOutside = this.HandleClickOutside.bind(this);
    this.HandleEscapeKey = this.HandleEscapeKey.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.HandleClickOutside);
    document.addEventListener("keyup", this.HandleEscapeKey);

    // Automatically focus on first input of modal
    const firstInput = document.querySelector(".modal-content input");
    if(firstInput) { firstInput.focus(); }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.HandleClickOutside);
    document.removeEventListener("keyup", this.HandleEscapeKey);
  }

  HandleClickOutside(event) {
    if(!this.props.closable) { return; }

    if (this.state.outsideContainerRef.current && !this.state.outsideContainerRef.current.contains(event.target)) {
      this.props.OnClickOutside();
    }
  }

  HandleEscapeKey(event) {
    // todo: use key
    if(event.keyCode === 27) {
      this.HandleClickOutside(event);
    }
  }

  render() {
    return (
      <div className={`-elv-modal ${this.props.className || ""}`}>
        <div className="-elv-modal-content" ref={this.state.outsideContainerRef}>
          <div className="-elv-modal-error">{this.props.errorMessage}</div>
          { this.props.children || this.props.modalContent }
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.node,
  modalContent: PropTypes.node,
  OnClickOutside: PropTypes.func,
  closable: PropTypes.bool, // Allow caller to prevent closing of modal
  errorMessage: PropTypes.string,
  className: PropTypes.string
};

export default Modal;
