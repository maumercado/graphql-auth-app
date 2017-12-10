import React, { Component } from "react";
import { graphql } from "react-apollo";
import currentUser from "../../queries/currentUser";

class Header extends Component {
    renderButtons() {
        const { user, loading } = this.props.data;
        if (loading) {
            return;
        }

        if (user) {
            return <div>Logout</div>;
        } else {
            return <div>Signup/Login</div>;
        }
    }
    render() {
        return (
            <nav>
                <div className="nav-wrapper">{this.renderButtons()}</div>
            </nav>
        );
    }
}

export default graphql(currentUser)(Header);
