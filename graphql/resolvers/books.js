const mongoose = require('mongoose');
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const booksResolver = {
    Query: {
        books: () => books,
    },

    // Mutation:{
    //     createUser: async(parent, args) => {

    //     }
    // }
};

module.exports = booksResolver;