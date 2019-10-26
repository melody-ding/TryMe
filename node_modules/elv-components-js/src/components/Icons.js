import "../stylesheets/icons.scss";

import SVG from "react-inlinesvg";
import React from "react";
import Link from "react-router-dom/es/Link";
import {onEnterPressed} from "../utils/Events";

export const CroppedIcon = ({
  icon,
  alternateIcon,
  label,
  className,
  iconClassName,
  useLoadingIndicator=false,
  ...props
}) => {
  return (
    <div className={className || ""} {...props}>
      <div className="-elv-cropped-icon">
        <ImageIcon
          icon={icon}
          alternateIcon={alternateIcon}
          label={label}
          className={iconClassName || ""}
          useLoadingIndicator={useLoadingIndicator}
        />
      </div>
    </div>
  );
};

export const CroppedIconWithAction = ({
  icon,
  alternateIcon,
  label,
  actionText,
  onClick,
  className,
  useLoadingIndicator=false,
  children,
  ...props
}) => {
  return (
    <div
      tabIndex="0"
      aria-label={label}
      onClick={onClick}
      onKeyPress={onEnterPressed(onClick)}
      className={className || ""}
    >
      <div className="-elv-cropped-icon -elv-cropped-icon-with-action" {...props} >
        <ImageIcon icon={icon} alternateIcon={alternateIcon} label={label} useLoadingIndicator={useLoadingIndicator}/>
        <div className="-elv-hover-action">
          <span>{actionText}</span>
          { children }
        </div>
      </div>
    </div>
  );
};

export const ImageIcon = ({icon, alternateIcon, label, useLoadingIndicator=true, className, ...props}) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  className = "-elv-icon " + (className || "");

  const currentIcon = error ? alternateIcon : icon;
  const handleError = error ? undefined : () => setError(true);

  if(!currentIcon) { return null; }

  if(currentIcon.startsWith("<svg")) {
    return (
      <SVG alt={label} className={className} src={currentIcon} {...props} />
    );
  } else {
    className = loading && useLoadingIndicator ? "-elv-icon-with-loader " + className : className;

    return (
      <img
        alt={label}
        className={className}
        src={currentIcon}
        onLoad={() => setLoading(false)}
        onError={handleError}
        {...props}
      />
    );
  }
};

export const IconButton = ({icon, label, title, onClick, disabled=false, hidden=false, className, ...props}) => {
  if(hidden) { return null; }

  className = "-elv-icon-button " + (className || "");

  return (
    <button
      {...props}
      type="button"
      role="button"
      aria-label={label}
      title={title || label}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <SVG className="-elv-icon" alt={label} src={icon} />
    </button>
  );
};

export const IconLink = ({icon, label, href, to, className, ...props}) => {
  className = "-elv-icon-link " + (className || "");

  if(href) {
    return (
      <a href={href} className={className}>
        <div className="-elv-icon-wrapper" {...props}>
          <ImageIcon icon={icon} className={className} label={label}/>
        </div>
      </a>
    );
  } else {
    return (
      <Link to={to} label={label} tabIndex={0} className={className}>
        <div className="-elv-icon-wrapper" {...props}>
          <ImageIcon icon={icon} className={className} label={label}/>
        </div>
      </Link>
    );
  }
};
