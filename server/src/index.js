const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
require('dotenv').config();

const resolvers = {
  Query: {
    feed(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: true } }, info);
    },
    drafts(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: false } }, info);
    },
    post(parent, { id }, ctx, info) {
      return ctx.db.query.post({ where: { id } }, info);
    },
    courseFeed(parent, args, ctx, info) {
      return ctx.db.query.courses({ where: { isPublished: false } }, info);
    }
  },
  Mutation: {
    createDraft(parent, { title, text }, ctx, info) {
      return ctx.db.mutation.createPost(
        {
          data: {
            title,
            text
          }
        },
        info
      );
    },
    createCourse(parent, { name, description }, ctx, info) {
      return ctx.db.mutation.createCourse(
        {
          data: {
            name,
            description
          }
        },
        info
      );
    },
    updateCourse(parent, { id, name, description }, ctx, info) {
      return ctx.db.mutation.updateCourse(
        {
          data: { name, description },
          where: { id: id }
        },
        info
      );
    },
    deletePost(parent, { id }, ctx, info) {
      return ctx.db.mutation.deletePost({ where: { id } }, info);
    },
    deleteCourse(parent, { id }, ctx, info) {
      return ctx.db.mutation.deleteCourse({ where: { id } }, info);
    },
    publish(parent, { id }, ctx, info) {
      return ctx.db.mutation.updatePost(
        {
          where: { id },
          data: { isPublished: true }
        },
        info
      );
    }
  }
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