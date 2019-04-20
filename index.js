const { ApolloServer } = require('apollo-server');

const typeDefs = `

  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  input PostPhotoInput {
    name: String!
    description: String
    category: PhotoCategory=PORTRAIT
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
  }

  const db = client.db();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const githubToken = req.headers.authorization;
      const currentUser = db.collection('users').findOne({ githubToken });
      return { db, currentUser };
    }
  });

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
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