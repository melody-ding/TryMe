import React, {useState} from "react";
import {CopyText} from "../utils/Clipboard";
import ToolTip from "./Tooltip";

export const Copy = ({copy, children, className}) => {
  const [copied, setCopied] = useState(false);

  return (
    <ToolTip
      content={copied ? "Copied" : "Copy to Clipboard"}
      onMouseLeave={() => setCopied(false)}
    >
      <span
        className={`${className || ""} -elv-copyable`}
        onClick={() => {
          CopyText(copy);
          setCopied(true);
        }}
      >
        { children }
      </span>
    </ToolTip>
  );
};

export const AsyncCopy = ({Load, children}) => {
  const [copy, setCopy] = useState(undefined);

  return (
    <Copy copy={copy}>
      <span
        onMouseEnter={async () => {
          if(!copy) { setCopy(await Load()); }
        }}
      >
        { children }
      </span>
    </Copy>
  );
};
