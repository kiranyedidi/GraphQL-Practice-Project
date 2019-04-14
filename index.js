const { ApolloServer } = require('apollo-server');

const typeDefs = `

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  type Mutation {
    postPhoto(name: String! description: String): Photo!
  }
`;

const photos = [];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
  },
  Mutation: {
    postPhoto: (parent, args) => {
      var newPhoto = {
        id: photos.length + 1,
        ...args
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