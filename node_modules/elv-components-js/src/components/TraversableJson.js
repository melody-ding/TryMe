import "../stylesheets/traversable-json.scss";

import React, {useEffect, useState} from "react";
import UrlJoin from "url-join";
import {onEnterPressed} from "../index";

const TraversableJson = ({expand=false, path="", label, json}) => {
  const [show, setShow] = useState(expand);
  const [expandChildren, setExpandChildren] = useState(expand);

  useEffect(() => {
    setShow(expand);
    setExpandChildren(expand);
  }, [expand]);

  let content, expandable;
  if(Array.isArray(json)) {
    if(json.length === 0) {
      content = <div className="literal">[ ]</div>;
    } else {
      expandable = true;
      content = (
        <React.Fragment>
          [
          <div className="indented">
            {
              json.map((value, i) => (
                <TraversableJson
                  key={`json-key-${path}-${i}`}
                  expand={expandChildren}
                  path={UrlJoin(path, i.toString())}
                  label={i.toString()}
                  json={value}
                />
              ))
            }
          </div>
          ]
        </React.Fragment>
      );
    }
  } else if(json !== null && typeof json === "object") {
    if(Object.keys(json).length > 0) {
      expandable = true;

      content = Object.keys(json).map(key => {
        return (
          <TraversableJson
            key={`json-key-${path}-${key}`}
            expand={expandChildren}
            path={UrlJoin(path, key)}
            label={key}
            json={json[key]}
          />
        );
      });
    }
  } else if(typeof json === "string") {
    content = <div className="literal">{JSON.stringify(json)}</div>;
  } else if(typeof json === "boolean") {
    content = <div className="literal">{json ? "true" : "false"}</div>;
  } else if(json === null || typeof json === "undefined") {
    content = <div className="literal">null</div>;
  } else {
    content = <div className="literal">{json}</div>;
  }

  // Top level component
  if(!path) {
    return (
      <div className="traversable-json">
        { content }
      </div>
    );
  }

  let expandButton;
  if(expandable) {
    expandButton = (
      <span
        hidden={!expandable || (show && expandChildren)}
        className="expand-button"
        tabIndex={0}
        role={"button"}
        onClick={() => {
          setShow(true);
          setExpandChildren(true);
        }}
        onKeyPress={onEnterPressed(() => {
          setShow(true);
          setExpandChildren(true);
        })}
        aria-label="Expand all"
        title="Expand all"
      >
        ▼
      </span>
    );
  }

  return (
    <div className="json-entry">
      <label
        onClick={() => {
          if(show) { setExpandChildren(false); }
          setShow(!show);
        }}
        onKeyPress={onEnterPressed(() => {
          if(show) { setExpandChildren(false); }
          setShow(!show);
        })}
        tabIndex={0}
        aria-label={`${show ? "Collapse" : "Expand"} ${label}`}
        title={`${show ? "Collapse" : "Expand"} ${label}`}
      >
        {label}
      </label>
      { expandButton }
      <div className="indented">
        { show ? content : null }
      </div>
    </div>
  );
};

export default TraversableJson;
