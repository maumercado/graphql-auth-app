import React from "react";
import { ApolloProvider } from "react-apollo";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import apolloClient from "../apolloClient";
import Header from "./layout/Header";
import Main from "./Main";
import LoginForm from "./LoginForm";

const App = () => {
    return (
        <ApolloProvider client={apolloClient}>
            <BrowserRouter>
                <div className="container">
                    <Header />
                    <Switch>
                        <Route exact path="/" component={Main} />
                        <Route path="/login" component={LoginForm} />
                    </Switch>
                </div>
            </BrowserRouter>
        </ApolloProvider>
    );
};

export default App;
