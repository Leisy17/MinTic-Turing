const express=require("express")
const path=require("path")
const exphdbs=require("express-handlebars")
const methodOverride=require("method-override")


//variables
const app=express()
require("./database")

//Configuración
app.set("port", 5500)
app.set("views", path.join(__dirname,"views"))
app.engine(".hbs", exphdbs.engine({
    defaultLayout:"main", //Marco por defecto
    layoutsDir:path.join(app.get("views"),"layouts"), //Directorio por defecto de marcos y plantillas
    partialsDir: path.join(app.get("views"),"partials"),
    extname:".hbs"
})
);
app.set("view engine", ".hbs"); //Utiliza configuración del engine

//Funciones
app.use(express.urlencoded({extended: false}))//No se aceptan formatos distintos a datos
app.use(methodOverride("_method")) //Extiende las funcionalidades de los formularios

//Pendiente configurar sessions

//rutas
app.use(require('./routes/index'))
app.use(require('./routes/proyectos'))
app.use(require('./routes/usuarios'))

//archivos
app.use(express.static(path.join(__dirname, "public")))


//Servidor escucha
app.listen(app.get("port"),()=>{
    console.log("Servidor activo y funcionando desde el puerto", app.get("port"))
})
