const { GraphQLScalarType } = require('graphql');
const fetch = require('node-fetch');

const photos = [];

const requestGithubToken = credentials =>
  fetch(
    `https://github.com/login/oauth/access_token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    .then(res => res.json())
    .catch(error => {
      throw new Error(JSON.stringify(error));
    })

const requestGithubUserAccount = token =>
  fetch(`https://api.github.com/user?access_token=${token}`)
    .then(res => res.json())
    .catch(error => {
      throw new Error(JSON.stringify(error));
    })

const authorizeWithGithub = async credentials => {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return { ...githubUser, access_token };
}

const resolvers = {
  Query: {
    totalPhotos: (parent, args, { db }) => db.collection('photos').estimatedDocumentCount(),
    allPhotos: (parent, args, { db }) => db.collection('photos').find().toArray(),
    totalUsers: (parent, args, { db }) => db.collection('users').estimatedDocumentCount(),
    allUsers: (parent, args, { db }) => db.collection('users').find().toArray(),
  },
  Mutation: {
    async githubAuth(parent, { code }, { db }) {
      let {
        message,
        access_token,
        avatar_url,
        login,
        name
      } = await authorizeWithGithub({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code
      })
      if (message) {
        throw new Error(message);
      }
      let latestUserInfo = {
        name,
        githubLogin: login,
        githubToken: access_token,
        avatar: avatar_url
      };

      const { ops: [user] } = await db
        .collection('users')
        .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });
      return { user, token: access_token };
    },
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

module.exports = resolvers;
