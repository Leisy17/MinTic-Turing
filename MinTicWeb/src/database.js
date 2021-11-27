const mongoose=require("mongoose")
const atlasUrl="mongodb+srv://admin:turing@cluster0.fsvgd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
try{
    //conexión con el cluster de BD
    mongoose.connect(
        atlasUrl, {useNewUrlParser: true, useUnifiedTopology: true},
        ()=> console.log("Estamos conectados a MongoDb en Atlas con Mongoose")
    );
    } catch(e){
        console.log("Error")
    }
