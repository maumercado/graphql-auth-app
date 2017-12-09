const fs = require("fs");

const router = {};

fs
    .readdirSync(__dirname)
    .filter(file => file !== "index.js")
    .forEach(file => {
        router[file.split("_")[0]] = require(`./${file}`);
    });

module.exports = router;
