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
    allPhotos(first: Int=1 start: Int=1): [Photo!]!
  }

  type Mutation {
    postPhoto(name: String! description: String): Photo!
  }
`;

const photos = [];

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