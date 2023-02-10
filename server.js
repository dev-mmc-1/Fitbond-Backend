const { constraintDirective, constraintDirectiveTypeDefs } = require('graphql-constraint-directive')

const { GraphQLError } = require('graphql');
const { authorizationMiddleWare } = require("./helpers/authHelper");
const { handleError } = require("./helpers/errorHelper");
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/schema');
const mongoose = require('mongoose');
require('dotenv').config();

const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect(process.env.MONGODBDB, options).then(
    (res) => { console.log("Successfull"); },
    err => { console.log("Handler", err); }
);

const schema = makeExecutableSchema({ typeDefs: [constraintDirectiveTypeDefs, typeDefs], resolvers });
// schema = constraintDirective()(schema)

const server = new ApolloServer({
    schema,
    formatError: (formattedError, error) => {
        console.log("Format_err", formattedError.message);
        console.log("custom_Err", error);
        return {
            ...formattedError,
            message: "Your query doesn't match the schema. Try double-checking it!",
        };
    }
    // formatError: (formattedError, error) => {
    //     if (formattedError.message.startsWith('Database Error: ')) {
    //       return { message: 'Internal server error' };
    //     }

    //     // Otherwise return the formatted error.
    //     return formattedError;
    //   }
});

const handleRunServer = async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4050 },
        // context: async ({ req, res }) => ({
        //     authScope: getScope(req.headers.authorization),
        //   }),
        context: async ({ req }) => {
            const token = (req.headers && req.headers.authorization) || '';
            if (token != '') {
                return authorizationMiddleWare(token)
            }
            return { token }
        }
    });
    console.log(`🚀  Server ready at: ${url}`);
}

handleRunServer()