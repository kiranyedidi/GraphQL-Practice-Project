const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default

const { readFileSync } = require('fs');

const typeDefs = readFileSync('./typedefs.graphql', 'UTF-8');
const resolvers = require('./resolvers');

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function start() {
  const app = express();
  const MONGO_DB = process.env.DB_HOST;
  const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true });

  const db = client.db();
  const context = { db };
  const server = new ApolloServer({ typeDefs, resolvers, context });

  server.applyMiddleware({ app });

  app.get('/', (req, res) => res.end('welcome to my GraphQL learning platform'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));;

  app.listen({ port: 4000 }, () => console.log(`Listening on http://localhost:4000${server.graphqlPath}`));
}

start();
