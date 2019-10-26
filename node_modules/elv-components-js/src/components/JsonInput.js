import "../stylesheets/inputs.scss";

// Properly handle input value updates
import React, {useState} from "react";
import PropTypes from "prop-types";
import {ParseInputJson} from "../utils/Input";

const JsonTextArea = ({name, value, onChange, className=""}) => {
  const [modifiedJSON, setModifiedJSON] = useState(value);
  const [error, setError] = useState();

  const HandleChange = event => {
    try {
      const json = JSON.stringify(ParseInputJson(modifiedJSON), null, 2);
      setModifiedJSON(json);

      event.target.value = json;

      setError(undefined);
    } catch(error) {
      setError(error.message);
    }

    onChange(event);
  };

  return (
    <textarea
      name={name}
      value={modifiedJSON}
      title={error}
      aria-errormessage={error}
      onChange={event => setModifiedJSON(event.target.value)}
      onBlur={HandleChange}
      className={`json-field ${error ? "invalid" : ""} ${className || ""}`}
    />
  );
};

JsonTextArea.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default JsonTextArea;
