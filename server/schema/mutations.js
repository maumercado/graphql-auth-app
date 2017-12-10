const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString } = graphql;
const UserType = require("./types/user_type");
const AuthService = require("../services/auth");

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            // req|ctx is the request coming
            // from express
            async resolve(parentValue, { email, password }, req) {
                try {
                    return await AuthService.signup({ email, password, req });
                } catch (e) {
                    throw e;
                }
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parentValue, { email, password }, req) {
                try {
                    return await AuthService.login({ email, password, req });
                } catch (err) {
                    throw err;
                }
            }
        },
        logout: {
            type: UserType,
            resolve(parentValue, args, req) {
                const { user } = req;
                req.logout();
                return user;
            }
        }
    }
});

module.exports = mutation;
