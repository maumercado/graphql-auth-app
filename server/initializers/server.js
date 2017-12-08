const Hapi = require("hapi");
const config = require("../../config");
const log = require("./log");

const server = new Hapi.Server({
    port: config.server.port,
    state: {
        strictHeader: false
    },
    routes: { cors: { origin: ["*"] } }
});

const initServer = async () => {
    try {
        await server.register([
            { plugin: require("inert") },
            { plugin: require("vision") },
            { plugin: require("../plugins/bunyan_logging"), options: { log } }
        ]);

        server.views({
            engines: {
                html: require("handlebars")
            },
            relativeTo: __dirname,
            path: "../client/build/"
        });

        server.ext("onPostHandler", (request, h) => {
            if (request.response.isBoom && request.response.output.statusCode === 404) {
                return h.view("404.html", {
                    config: JSON.stringify(config.client)
                });
            }

            return h.continue;
        });

        const ReactRoutes = [
            {
                method: "GET",
                path: "/{param*}",
                handler: {
                    directory: {
                        path: "client/build"
                    }
                }
            },
            {
                method: "GET",
                path: "/",
                handler(request, h) {
                    return h.view("index.html", {
                        config: JSON.stringify(config.client)
                    });
                }
            }
        ];

        server.route(ReactRoutes);

        await server.start();
        log.info({ info: server.info }, "Server started");
    } catch (e) {
        log.error({ err: e }`Error ${e.message}`);
        throw new Error(e);
    }
};

module.exports = initServer;
