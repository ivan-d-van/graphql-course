const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
require('dotenv').config();
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const AuthPayload = require('./resolvers/AuthPayload');
const CourseFeed = require('./resolvers/CourseFeed');

const resolvers = {
  Query,
  Mutation,
  AuthPayload,
  CourseFeed
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: process.env.PRISMA_ENDPOINT,
      debug: true
    })
  })
});

server.start(() => console.log('Server is running on http://localhost:4000'));
