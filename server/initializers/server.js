const express = require("express");
const aaWrapper = require("express-async-await");
const path = require("path");
const bunyanMiddleware = require("bunyan-middleware");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const config = require("../../config");
const log = require("./log");
const routerV1 = require("../v1/routes");

const initServer = async () => {
    try {
        const server = aaWrapper(express());

        server.use(
            bunyanMiddleware({
                headerName: "X-Request-Id",
                propertyName: "reqId",
                logName: "req_id",
                obscureHeaders: ["Authorization"],
                logger: log
            })
        );

        // Configures express to use sessions.  This places an encrypted identifier
        // on the users cookie.  When a user makes a request, this middleware examines
        // the cookie and modifies the request object to indicate which user made the request
        // The cookie itself only contains the id of a session; more data about the session
        // is stored inside of MongoDB.
        server.use(
            session({
                resave: true,
                saveUninitialized: true,
                secret: "aaabbbccc",
                store: new MongoStore({
                    url: config.server.db,
                    autoReconnect: true
                })
            })
        );

        // Passport is wired into express as a middleware. When a request comes in,
        // Passport will examine the request's session (as set by the above config) and
        // assign the current user to the 'req.user' object.  See also servces/auth.js
        server.use(passport.initialize());
        server.use(passport.session());

        // Instruct Express to pass on any request made to the '/graphql' route
        // to the GraphQL instance.
        server.use(routerV1.graphql);
        server.use(express.static(path.resolve(__dirname, "../../client", "build")));
        server.use(routerV1.react);

        server.use((err, req, res, next) => {
            log.error({ err }, "Server Error");
            res.status(500).send("Ouch!");
        });

        server.listen(config.server.port, () => {
            log.info({ ...server.info }, `Server Started on port ${config.server.port}`);
        });
    } catch (e) {
        log.error({ err: e }`Error ${e}`);
        throw new Error(e);
    }
};

module.exports = initServer;
