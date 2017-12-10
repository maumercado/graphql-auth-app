import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import { compose } from "recompose";
import currentUser from "../../queries/currentUser";
import logoutUser from "../../mutations/logoutUser";

class Header extends Component {
    onLogoutClick = () => {
        this.props.mutate({
            refetchQueries: [{ query: currentUser }]
        });
    };

    renderButtons() {
        const { user, loading } = this.props.data;
        if (loading) {
            return;
        }

        if (user) {
            return (
                <li>
                    <a onClick={this.onLogoutClick}>Logout</a>
                </li>
            );
        } else {
            return (
                <div>
                    <li>
                        <Link to="/signup">Signup</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                </div>
            );
        }
    }

    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <Link to="/" className="brand-logo left">
                        Home
                    </Link>
                    <ul className="right">{this.renderButtons()}</ul>
                </div>
            </nav>
        );
    }
}

export default compose(graphql(currentUser), graphql(logoutUser))(Header);
