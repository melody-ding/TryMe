import "../stylesheets/error-handler.scss";

import React from "react";
import Action from "./Action";

const ErrorHandler = Component => {
  class ErrorHandlerComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        error: undefined,
        errorMessage: undefined,
        componentVersion: 1
      };
    }

    async componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    componentDidCatch(error) {
      if(this.mounted) {
        // eslint-disable-next-line no-console
        console.error(error);

        this.setState({
          error,
          errorMessage: typeof error === "string" ? error : error.message || error.errorMessage
        });
      }
    }

    render() {
      if (this.state.error) {
        return (
          <div className="-elv-error-container">
            <div className="-elv-error">
              <h4>Error: {this.state.errorMessage}</h4>
              <Action onClick={() =>
                this.setState({
                  error: undefined,
                  errorMessage: undefined,
                  componentVersion: this.state.componentVersion + 1
                })}
              >
                Reload
              </Action>
            </div>
          </div>
        );
      }

      return this.props.children;
    }
  }

  return props => (
    <ErrorHandlerComponent>
      <Component {...props} />
    </ErrorHandlerComponent>
  );
};


export default ErrorHandler;
