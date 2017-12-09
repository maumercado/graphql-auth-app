const mongoose = require("mongoose");
const log = require("./log").child({ module: "mongo-initializer" });
const config = require("../../config");

const initDb = async () => {
    try {
        // Mongoose's built in promise library is deprecated, replace it with ES2015 Promise
        mongoose.Promise = global.Promise;

        // Connect to the mongoDB instance and log a message
        // on success or failure
        const con = await mongoose.connect(config.server.db, { useMongoClient: true });
        const { host, port, user, name, options, readyState } = con;
        log.info({ host, port, user, name, options, readyState }, "connected to mongo");
    } catch (error) {
        log.debug({ err: error }, "Error connecting to mongo");
        throw new Error(error);
    }
};

module.exports = initDb;
