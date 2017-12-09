module.exports = {
    server: {
        port: process.env.PORT || 4000,
        log: {
            level: process.env.NODE_LEVEL
        },
        db: process.env.MONGO_URI
    }
};
