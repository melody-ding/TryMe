import "../stylesheets/balance.scss";

import React from "react";
import {ImageIcon} from "./Icons";
import TokenIcon from "../icons/Token.png";

const Balance = ({balance, className}) => {
  if(!balance) { return null; }
  return (
    <span className={"-elv-balance " + (className || "")}>
      <ImageIcon icon={TokenIcon} className="-elv-token-icon" label="Eluvio Token Icon"/>
      {balance}
    </span>
  );
};

export default Balance;
