const bunyan = require("bunyan");

const config = require("../../config").server;
const name = require("../../package.json").name;

module.exports = bunyan.createLogger({
    name,
    level: config.log.level || "debug",
    serializers: bunyan.stdSerializers
});
