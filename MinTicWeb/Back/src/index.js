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
    signUp: async (root, { input }, { db }) => { //Root es el return de la BD || SignUp es el Registro de usuarios con distintos roles
      const hashedPassword = bcrypt.hashSync(input.password) //traer el password y almacenar en una variable
      const newUser = {
        ...input,
        password: hashedPassword,
      }
      var client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      var db=client.db(DB_NAME)
      const result = await db.collection("user").insertOne(newUser); //Función asíncrona que puede recibir 3 argumentos y regresa un objeto
      

      return {
        user: newUser,
        token: "token"
      }
    },

    signIn: async (root, { input }, { db }) => { //Root es el return de la BD
      var client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      var db=client.db(DB_NAME)
      const user=await db.collection("user").findOne({mail:input.mail});
      console.log(user)
      const isPaswwordCorrect = user && bcrypt.compareSync(input.password,user.password);
      if (!user || !isPaswwordCorrect){
        throw new Error("Las credenciales no son correctas");
      }
      return{
      user,
      token:"token"
      }
  },

    modifyUser: async (root, { input }, { db }) =>{
      var client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      var db=client.db(DB_NAME)
      const user=await db.collection("user").findOne({mail:input.mail});
      const isPaswwordCorrect = user && bcrypt.compareSync(input.password,user.password);
      if (!user || !isPaswwordCorrect){
        throw new Error("Las credenciales no son correctas");
      }else{
      var modify=await db.collection("user").update(user,
        {
          $set: 
          {
            "mail":input.mail,
            "nombre":input.nombre,
            "identificacion":input.identificacion,
            "rol":input.rol,
            "password":input.password}
          }
        );
      }
    
    return{
      user,
      modify,
      token:"token"
      }
    },

    crearProyectos: async (root, { input }, { db }) => {
      const newProject = {
        ...input        
      }
      var client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      var db=client.db(DB_NAME)
      const user=await db.collection("user").findOne({mail:input.mail});
      console.log(user)
      const isPaswwordCorrect = user && bcrypt.compareSync(input.password,user.password);
      if (!user || !isPaswwordCorrect){
        throw new Error("Las credenciales no son correctas");
      }else{
      var result = await db.collection("Proyectos").insertOne(newProject); //Función asíncrona que puede recibir 3 argumentos y regresa un objeto
      }
    return{
      user,
      result,
      token:"token"
    }
}
  },
      //Parámetros inmutables del user
      user: {
        id: (root) => {
          return root._id;
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
  
  type TaskList{
    id:ID!
    createAt:String!
    title:String!
    progress:Float!
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
      nombreProyecto:String!
      objGen:String!
      objEsp:String!
      presupuesto:String!
      fechain:String!
      fechafin:String!
      user:[user!]!
  }
  
  type Mutation{
      signIn(input:signInInput):AuthUser!
      signUp(input:signUpInput):AuthUser!
      modifyUser(input:modifyUserInput):AuthUser!
      crearProyectos(input:crearProyectosInput):Authrol!
  }
  input crearProyectosInput{
      nombreProyecto:String!
      mail:String!
      objGen:String!
      objEsp:String!
      presupuesto:String!
      fechain:String!
      fechafin:String!
  }
  input signInInput{
      mail:String!
      password:String!
  }
    
    type AuthUser{
      user:user!
      token: String!
    }
    type Authrol{
      user:user!
      token: String!
    }

    input signUpInput{
      mail:String!
      identificacion:String!
      nombre:String!
      password:String!
      rol:String!
    }
    input modifyUserInput{
      mail:String!
      identificacion:String!
      nombre:String!
      password:String!
      rol:String!
    }
  `;


