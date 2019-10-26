import "../stylesheets/radio.scss";

import React from "react";
import PropTypes from "prop-types";

class RadioSelect extends React.Component {
  constructor(props) {
    super(props);

    let selectedIndex = 0;
    if(props.selected) {
      selectedIndex = props.options.findIndex(option => option[1] === props.selected);
    }

    this.state = {
      selectedIndex,
      refs: props.options.map(() => React.createRef())
    };

    this.HandleClick = this.HandleClick.bind(this);
    this.HandleArrows = this.HandleArrows.bind(this);
  }

  HandleClick(index) {
    const value = this.props.options[index][1];

    this.setState({
      selectedIndex: index
    });

    this.state.refs[index].current.focus();

    this.props.onChange({target: {name: this.props.name, value}});
  }

  HandleArrows(event) {
    if(event.type !== "keydown") { return; }
    const key = event.key.toLowerCase();

    let nextIndex;
    switch(key) {
      case "arrowdown":
      case "arrowright":
        nextIndex = (this.state.selectedIndex + 1) % this.props.options.length;
        break;
      case "arrowup":
      case "arrowleft":
        nextIndex = this.state.selectedIndex === 0 ? this.props.options.length - 1 : this.state.selectedIndex - 1;
        break;
      default:
        return;
    }

    this.HandleClick(nextIndex);

    event.preventDefault();
    event.stopPropagation();
  }

  RadioOption(option, index) {
    const optionLabel = option[0];
    const optionValue = option[1];

    const checked = optionValue === this.props.selected;
    return (
      <div
        role="radio"
        aria-checked={checked}
        tabIndex={checked ? 0 : -1}
        onClick={() => this.HandleClick(index)}
        ref={this.state.refs[index]}
        className={`-elv-radio-option ${this.props.inline ? "-elv-radio-inline" : ""} ${checked ? "-elv-radio-selected" : ""}`}
        key={"radio-select-" + this.props.name + "-" + optionValue }
      >
        {optionLabel}
      </div>
    );
  }

  render() {
    return (
      <div
        role="radiogroup"
        onKeyDown={this.HandleArrows}
        className={`-elv-radio ${this.props.inline ? "-elv-radio-inline": ""}`}
      >
        { this.props.options.map((option, index) => this.RadioOption(option, index)) }
      </div>
    );
  }
}

const allowedOptionTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
]);

// Options is a list of label+name pairs
RadioSelect.propTypes = {
  name: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.arrayOf(
      allowedOptionTypes
    )
  ).isRequired,
  selected: allowedOptionTypes,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default RadioSelect;
