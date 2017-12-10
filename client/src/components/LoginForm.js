import React, { Component } from "react";
import { graphql } from "react-apollo";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import loginUser from "../mutations/loginUser";
import currentUser from "../queries/currentUser";
import AuthForm from "./AuthForm";

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = { errors: [] };
    }

    componentWillUpdate(nextProps) {
        if (!this.props.data.user && nextProps.data.user) {
            this.props.history.push("/dashboard");
        }
    }

    onSubmit = async ({ email, password }) => {
        try {
            await this.props.mutate({
                variables: { email, password },
                refetchQueries: [{ query: currentUser }]
            });
        } catch (err) {
            // err.graphQLErrors => Array[0].message
            const errors = err.graphQLErrors.map(error => error.message);
            this.setState({ errors });
        }
    };

    render() {
        return (
            <div>
                <h3>Login</h3>
                <AuthForm onSubmit={this.onSubmit} errors={this.state.errors} />
            </div>
        );
    }
}

export default compose(withRouter, graphql(currentUser), graphql(loginUser))(LoginForm);
