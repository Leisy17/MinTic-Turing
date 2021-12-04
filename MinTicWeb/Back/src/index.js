const { ApolloServer, gql } = require('apollo-server');
var { MongoClient, Db } = require('mongodb');
const dotenv = require('dotenv').config();
const bcrypt = require('bcryptjs');
process.env.DB_URI = 'mongodb+srv://admin:turing@cluster0.fsvgd.mongodb.net/ciclo4?retryWrites=true&w=majority';
process.env.DB_NAME = 'ciclo4';
const {DB_URI,DB_NAME}=process.env


const resolvers = {
  
  Query: {
    misProyectos: () => []
  },

  //Mutaciones
  Mutation: {
    signUp: async (root, { input }, { db }) => { //Root es el return de la BD
      const hashedPassword = bcrypt.hashSync(input.password) //traer el password y almacenar en una variable
      const newUser = {
        ...input,
        password: hashedPassword,
      }
      var client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      var db=client.db(DB_NAME)
      console.log(db)
      const result = await db.collection("user").insertOne(newUser); //Función asíncrona que puede recibir 3 argumentos y regresa un objeto
      const user = result.ops[0]

      return {
        user: newUser,
        token: "token",
      }
    }
  },

  user: {
    id: (root) => {
      return root.id;
    }
  }
};

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const start = async () => {
  const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DB_NAME);
  const context = {
    db,
  }
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({ typeDefs, resolvers });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });

};
start();

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
  
    type Mutation{
      signUp(input:signUpInput):AuthUser!
  
    }
    input signUpInput{
      mail:String!
      identificacion:String!
      nombre:String!
      password:String!
      rol:String!
    }
    
    type AuthUser{
      user:user!
      token: String!
    }
  
  
  `;


