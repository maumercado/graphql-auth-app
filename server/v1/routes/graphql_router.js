const express = require("express");
const router = express.Router();
const expressGraphQL = require("express-graphql");
const schema = require("../../schema/schema");

router.use(
    "/graphql",
    expressGraphQL({
        schema,
        graphiql: true
    })
);

module.exports = router;
