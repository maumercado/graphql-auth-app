const serverInitializer = require("./server/initializers/").server;
const dbInit = require("./server/initializers/db");

try {
    dbInit();
    serverInitializer();
} catch (err) {
    throw err;
}
