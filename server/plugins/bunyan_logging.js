const assert = require("assert");

const Logging = {
    name: "Bunyan Logging",
    version: "0.0.3",
    register: (server, options) => {
        assert.ok(options.log, "options.log is required");
        const { log } = options;

        server.ext("onRequest", (request, h) => {
            request.startTime = new Date().getTime();
            log.info({ req: request }, `[REQUEST] ${request.method.toUpperCase()} ${request.url.path}`);
            return h.continue;
        });

        server.events.on("response", request => {
            request.response.responseTime = new Date().getTime() - request.startTime;

            log.info(
                { res: request.response },
                `[RESPONSE] ${request.method.toUpperCase()} ${request.url.path} ${request.response.statusCode} ${
                    request.response.responseTime
                }ms`
            );
        });
    }
};

module.exports = Logging;
