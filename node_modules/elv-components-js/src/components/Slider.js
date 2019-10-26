import "../stylesheets/slider.scss";

import React from "react";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";
import ToolTip from "./Tooltip";

export class Range extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliderElement: undefined,
      hoverPosition: props.min,
      draggingHandle: undefined
    };

    this.WatchResize = this.WatchResize.bind(this);
    this.ToolTip = this.ToolTip.bind(this);
    this.Handle = this.Handle.bind(this);
    this.HandleChange = this.HandleChange.bind(this);
    this.StartMouseover = this.StartMouseover.bind(this);
    this.MouseoverMove = this.MouseoverMove.bind(this);
    this.EndMouseover = this.EndMouseover.bind(this);
    this.StartDrag = this.StartDrag.bind(this);
    this.Drag = this.Drag.bind(this);
    this.EndDrag = this.EndDrag.bind(this);
  }

  componentWillUnmount() {
    if(this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  }

  // Ensure slider width is updated on resize
  WatchResize(element) {
    if(element && !this.resizeObserver) {
      this.resizeObserver = new ResizeObserver((entries) => {
        const container = entries[0];

        this.setState({
          width: container.contentRect.width
        });
      });

      this.resizeObserver.observe(element);
    }
  }

  /* Behavior */

  /* Hover tooltip */
  StartMouseover() {
    window.addEventListener("mousemove", this.MouseoverMove);
  }

  MouseoverMove(event) {
    clearTimeout(this.tooltipTimeout);

    this.tooltipTimeout = setTimeout(() => this.setState({hoverPosition: this.ClientXToPosition(event.clientX)}), 10);
  }

  EndMouseover() {
    window.removeEventListener("mousemove", this.MouseoverMove);
  }

  /* Dragging */
  StartDrag(event) {
    if(!event.shiftKey) {
      this.setState({
        draggingHandle: this.ClosestHandleIndex(event),
      });
    }

    window.addEventListener("mousemove", this.Drag);
    window.addEventListener("mouseup", this.EndDrag);

    this.state.sliderElement.style.cursor = "grab";

    this.HandleChange(event);
  }

  Drag(event) {
    clearTimeout(this.dragTimeout);

    this.dragTimeout = setTimeout(() => this.HandleChange(event), 10);
  }

  EndDrag() {
    this.setState({
      draggingHandle: undefined
    });

    this.state.sliderElement.style.cursor = "pointer";

    window.removeEventListener("mousemove", this.Drag);
    window.removeEventListener("mouseup", this.EndDrag);
  }

  HandleChange(event) {
    if(!this.props.onChange) { return; }

    let value = this.ClientXToPosition(event.clientX);
    if(this.props.handles.length === 1) {
      // Slider - only one handle
      this.props.onChange(value);
    } else if(event.shiftKey) {
      // Dragging whole range
      if(event.type !== "mousemove") { return; }

      const diff = event.movementX * this.Scale() / 1000;

      this.props.onChange(this.props.handles.map(handle =>
        Math.min(this.props.max, Math.max(this.props.min, handle.position + diff))
      ));
    } else {
      // Range - multiple handles
      // Drag handles
      let values = this.props.handles.map(handle => handle.position);
      const handleIndex = this.state.draggingHandle || this.ClosestHandleIndex(event);

      // Ensure handles don't cross
      if(handleIndex > 0) {
        value = Math.max(value, values[handleIndex - 1]);
      }

      if(handleIndex < values.length - 1) {
        value = Math.min(value, values[handleIndex + 1]);
      }

      values[handleIndex] = value;

      this.props.onChange(values);
    }
  }

  /* Positioning */

  // Get handle closest to pointer
  ClosestHandleIndex(event) {
    const position = this.ClientXToPosition(event.clientX);
    let handleIndex = 0;
    let closestHandle = this.props.max * 2;

    this.props.handles.forEach((handle, i) => {
      const distance = Math.abs(handle.position - position);
      if(distance < closestHandle) {
        closestHandle = distance;
        handleIndex = i;

        if(handle.disabled) {
          // Closest handle is disabled - select the previous or next handle based on the position clicked
          if(handle.position - position > 1) {
            handleIndex = i - 1;
          } else {
            handleIndex = i + 1;
          }
        }
      }
    });

    return handleIndex;
  }

  ClientXToPosition(clientX) {
    const left = this.state.sliderElement.getBoundingClientRect().left;
    const position = (this.Scale() * ((clientX - left) / this.state.width)) + this.props.min;

    return Math.min(Math.max(this.props.min, position), this.props.max);
  }

  Scale() {
    return this.props.max - this.props.min;
  }

  PositionToPixels(position) {
    const pixels = (position - this.props.min) * (this.state.width / this.Scale());

    return Math.min(Math.max(0, pixels), this.state.width);
  }

  /* Elements */

  ToolTip(position) {
    if(position === undefined) { position = this.state.hoverPosition; }

    return this.props.renderToolTip ? this.props.renderToolTip(position) : <span>{position}</span>;
  }

  ActiveTrack() {
    const positions = this.props.handles.map(handle => handle.position);
    const min = positions.length === 1 ? this.props.min : positions.reduce((min, p) => p < min ? p : min);
    const max = positions.reduce((max, p) => p > max ? p : max);

    return (
      <div
        style={{
          left: this.PositionToPixels(min),
          right: this.state.width - this.PositionToPixels(max)
        }}
        data-slider-active={true}
        className="-elv-slider-active"
      />
    );
  }

  Handle(handle, i) {
    const dragging = this.state.draggingHandle === i;
    return (
      <div
        key={`-elv-slider-handle-${i}`}
        style={{left: `${this.PositionToPixels(handle.position)}px`}}
        className={`-elv-slider-handle ${dragging ? "-elv-slider-handle-active" : ""} ${handle.className || ""}`}
      />
    );
  }

  Marks() {
    if(!this.props.showMarks) { return null; }

    const nMarks = 10;
    const scaleInterval = (this.props.max - this.props.min) / nMarks;
    const scaleOffset = scaleInterval / 2;
    const widthInterval = this.state.width / nMarks;
    const widthOffset = widthInterval / 2;
    let marks = [];

    for(let i = 0; i < nMarks; i++) {
      const scalePosition = this.props.min + (scaleInterval * i + scaleOffset);
      const passed = this.props.handles[0].position > scalePosition;
      marks.push(
        <div
          style={{left: widthInterval * i + widthOffset }} key={`-elv-slider-mark-${i}`}
          className={`-elv-slider-mark ${passed ? "-elv-slider-mark-passed" : ""}`}
        >
          <div className="-elv-slider-mark-notch" />
          <div className="-elv-slider-mark-text">
            { this.ToolTip(scalePosition) }
          </div>
        </div>
      );
    }

    return (
      <div className="-elv-slider-marks-container">
        { marks }
      </div>
    );
  }

  Slider() {
    if(!this.state.width) { return null; }

    return (
      <div
        onMouseEnter={this.StartMouseover}
        onMouseLeave={this.EndMouseover}
        ref={(sliderElement) => {
          if(!this.state.sliderElement) {
            this.setState({sliderElement});
          }
        }}
        className="-elv-slider"
      >
        <ToolTip content={this.ToolTip()}>
          <div
            onMouseDown={this.StartDrag}
            onMouseUp={this.EndDrag}
            onClick={this.HandleChange}
            className="-elv-slider-overlay"
          >
            { this.ActiveTrack() }
            { this.props.handles.map(this.Handle) }
          </div>
        </ToolTip>
        { this.Marks() }
      </div>
    );
  }

  render() {
    return (
      <div
        ref={this.WatchResize}
        className={`
          -elv-slider-container
          ${this.props.showMarks ? "-elv-slider-with-marks" : ""}
          ${this.props.className || ""}
        `}
      >
        { this.Slider() }
      </div>
    );
  }
}

export const Slider = ({...props}) => {
  const sliderProps = {...props};

  // Convert single value into a handle
  sliderProps.handles = [{
    position: props.value,
    className: props.handleClassName || ""
  }];
  delete sliderProps.value;
  delete sliderProps.handleClassName;

  return (
    <Range
      {...sliderProps}
    />
  );
};

const commonPropTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  showMarks: PropTypes.bool,
  onChange: PropTypes.func,
  renderToolTip: PropTypes.func
};

Range.propTypes = {
  ...commonPropTypes,
  handles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Slider.propTypes = {
  ...commonPropTypes,
  value: PropTypes.number.isRequired,
  handleClassName: PropTypes.string
};
