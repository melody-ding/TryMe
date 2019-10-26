import "../stylesheets/editable-field.scss";

import React from "react";
import PropTypes from "prop-types";

import EditIcon from "../icons/edit.svg";
import SaveIcon from "../icons/check.svg";
import {IconButton} from "./Icons";
import {onEnterPressed} from "..";
import Truncate from "react-truncate";

class EditableField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      value: props.value,
      showAll: false
    };

    this.Edit = this.Edit.bind(this);
    this.Save = this.Save.bind(this);
  }

  async Save() {
    if(this.state.value !== this.props.value) {
      await this.props.onChange(this.state.value);
    }

    this.setState({editing: false});
  }

  async Edit() {
    this.setState({
      editing: true,
      value: this.props.value
    });
  }

  EditDisplay() {
    let input;
    switch(this.props.type) {
      case "textarea":
        input = (
          <textarea
            value={this.state.value}
            className={`${this.props.editClassName || ""}`}
            onChange={event => this.setState({value: event.target.value})}
          />
        );
        break;

      default:
        input = (
          <input
            value={this.state.value}
            onChange={event => this.setState({value: event.target.value})}
            onKeyPress={onEnterPressed(this.Save)}
          />
        );
    }

    return (
      <div className={`-elv-editable-field -elv-editing ${this.props.editClassName || ""}`}>
        { input }
        <IconButton
          icon={SaveIcon}
          onClick={this.Save}
        />
      </div>
    );
  }

  Display() {
    let display = <div>{this.props.value}</div>;

    if(this.props.truncate && this.props.lines) {
      display = (
        <Truncate
          className={`-elv-truncated-field ${this.state.showAll ? "" : "truncated"}`}
          onClick={() => this.setState({showAll: !this.state.showAll})}
          lines={!this.state.showAll && this.props.lines}
          tag={"div"}
        >
          { this.props.value }
        </Truncate>
      );
    }

    switch(this.props.type) {
      default:
        return (
          <div className={`-elv-editable-field ${this.props.className || ""}`}>
            { display }
            <IconButton
              icon={EditIcon}
              onClick={this.Edit}
            />
          </div>
        );
    }
  }

  render() {
    return this.state.editing ? this.EditDisplay() : this.Display();
  }
}

EditableField.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  truncate: PropTypes.bool,
  lines: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  editClassName: PropTypes.string
};

export default EditableField;
