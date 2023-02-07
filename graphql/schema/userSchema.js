const userTypeDefs = `
input createUserInput {
  email: String! @constraint(pattern: "/^[^\s@]+@[^\s@]+\.[^\s@]+$/", maxLength: 12)
  password: String!
  fullName: String!
  mobileNumber: String!
  gender: String!
}

input loginInput {
  email: String! 
  password: String!
}

input forgotPasswordInput {
  email: String! @constraint(pattern: "/^[^\s@]+@[^\s@]+\.[^\s@]+$/", maxLength: 28)
}

input verifyOTPInput {
  otpCode: Int!
}

input resetPasswordInput {
  email: String
  password: String
}


type showMessage {
   message: String
}

type User {
  email: String
  fullName: String
  mobileNumber: String
  gender: String
  token: String
}

input addUserInterestType {
  sportsId: String
  userId: String
  level: String
}

input addSportInput {
  name: String!
  image: String
}

type Sport {
  name: String!
  image: String
}

type Book {
  author: String
  title: String
}

type Query {
  sports: [Sport]
}

type Mutation {
  createUser(input: createUserInput!): showMessage
  loginUser(input: loginInput!): User
  forgotPassword(input: forgotPasswordInput!): showMessage
  verifyOTP(input: verifyOTPInput!): showMessage
  resetPassword(input: resetPasswordInput!): showMessage
  addUserInterest(input: [addUserInterestType]!): showMessage
  addSport(input: addSportInput!): showMessage
}
`;

module.exports = userTypeDefs;



