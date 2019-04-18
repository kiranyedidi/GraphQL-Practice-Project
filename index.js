const { ApolloServer } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');

const typeDefs = `
  scalar DateTime
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
    created: DateTime!
  }

  type Query {
    totalPhotos: Int!
    allPhotos(first: Int=1 start: Int=1): [Photo!]!
    photosAfter(after: DateTime!): [Photo!]!
  }

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
    },
    photosAfter: (parent, args) => {
      // console.log(args);
      return photos.filter(photo => photo.created > inputDate);
    }
  },
  Mutation: {
    postPhoto: (parent, args) => {
      var newPhoto = {
        id: photos.length + 1,
        created: new Date(),
        ...args.input
      }
      photos.push(newPhoto);
      return newPhoto;
    }
  },
  Photo: {
    url: (parent) => `http://www.google.com/img/${parent.id}.jpg`,
    id: (parent) => `Kiran - ${parent.id}`
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'a valid date time value',
    // serialize: gets invoked when serializing the result to send it back to a client.

    // parseValue: gets invoked to parse client input that was passed through variables.

    // parseLiteral: gets invoked to parse client input that was passed inline in the query.

    serialize: value => new Date(value).toISOString(),
    parseValue: value => new Date(value),
    parseLiteral: ast => new Date(ast.value),
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => console.log(`GraphQL service running on ${url}`));