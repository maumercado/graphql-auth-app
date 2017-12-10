import React, { Component } from "react";
import { graphql } from "react-apollo";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import currentUser from "../queries/currentUser";

export default ComposedComponent => {
    class RequireAuth extends Component {
        componentWillUpdate(nextProps) {
            if (!nextProps.data.user && !nextProps.data.loading) {
                this.props.history.push("/");
            }
        }

        render() {
            return (
                <div>
                    {!this.props.data.loading && this.props.data.user ?
                        <ComposedComponent {...this.props} />
                        : null}
                </div>
            );
        }
    }
    return compose(withRouter, graphql(currentUser))(RequireAuth);
};
