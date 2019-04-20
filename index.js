<<<<<<< Updated upstream
const { ApolloServer } = require('apollo-server');

const typeDefs = `

  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }
=======
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default

const { readFileSync } = require('fs');
>>>>>>> Stashed changes

const typeDefs = readFileSync('./typedefs.graphql', 'UTF-8');
const resolvers = require('./resolvers');

<<<<<<< Updated upstream
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
  }

  type Query {
    totalPhotos: Int!
    allPhotos(first: Int=1 start: Int=1): [Photo!]!
  }
=======
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function start() {
  const app = express();
  const MONGO_DB = process.env.DB_HOST;
  const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true });
>>>>>>> Stashed changes

  const db = client.db();
  const context = { db };
  const server = new ApolloServer({ typeDefs, resolvers, context });

  server.applyMiddleware({ app });

<<<<<<< Updated upstream
const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: (parent, args) => {
      const { first, start } = args;
      var photosToReturn = [];
      if (!(first || start)) {
        photosToReturn = photos;
      } else if (first && start && start + first <= photos.length + 1) {
        for (i = start - 1; i < start - 1 + first; i++) {
          photosToReturn.push(photos[i]);
        }
      }
      return photosToReturn;
    }
  },
  Mutation: {
    postPhoto: (parent, args) => {
      var newPhoto = {
        id: photos.length + 1,
        ...args.input
      }
      photos.push(newPhoto);
      return newPhoto;
    }
  },
  Photo: {
    url: (parent) => `http://www.google.com/img/${parent.id}.jpg`,
    id: (parent) => `Kiran - ${parent.id}`
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => console.log(`GraphQL service running on ${url}`));
=======
  app.get('/', (req, res) => res.end('welcome to my GraphQL learning platform'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));;

  app.listen({ port: 4000 }, () => console.log(`Listening on http://localhost:4000${server.graphqlPath}`));
}

start();
>>>>>>> Stashed changes
