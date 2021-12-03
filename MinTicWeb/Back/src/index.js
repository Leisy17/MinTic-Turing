const { ApolloServer, gql } = require('apollo-server');
const dotenv=require("dotenv")
dotenv.config();
const { MongoClient } = require('mongodb');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

type Query{
  misProyectos: [proyectos!]!
}

  type user{
    id:ID!
    mail:String!
    identificacion:String!
    nombre:String!
    password:String!
    rol:String!
  }
  type proyectos{
    id:ID!
    nombre:String!
    objGen:String!
    objEsp:String!
    presupuesto:String!
    fechain:String!
    fechafin:String!
    user:[user!]!
  }
`;
const start=async()=>{
    const DB_URI = 'mongodb+srv://admin:turing@cluster0.fsvgd.mongodb.net/ciclo4?retryWrites=true&w=majority'
    const DB_NAME= 'ciclo4'
    const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db=client.db(DB_NAME)
  }
start().catch((e)=>console.log(e))




  // Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      misProyectos: () => []
    },
  };

  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

start();