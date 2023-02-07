const { GraphQLError } = require('graphql');
const errorName = require('../utilities/errors');

module.exports = {
    handleError: (message, code, statusCode) => {
         return new GraphQLError(message, {
            extensions: {
                // code: code,
                statusCode: statusCode
            }
        });
    }
}