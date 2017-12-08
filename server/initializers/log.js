const bunyan = require("bunyan");

const config = require("../../config").server;
const name = require("../../package.json").name;

const reqSerializer = request => {
    return {
        id: request.info.id,
        url: request.url.path,
        headers: request.headers,
        address: request.info.remoteAddress,
        method: request.method.toUpperCase(),
        port: request.info.remotePort
    };
};

const resSerializer = response => {
    return {
        headers: response.header,
        statusCode: response.statusCode,
        responseTime: response.responseTime
    };
};

module.exports = bunyan.createLogger({
    name,
    level: config.log.level || "debug",
    serializers: {
        req: reqSerializer,
        res: resSerializer,
        err: bunyan.stdSerializers.err
    }
});