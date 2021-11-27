const express=require("express")

const router=express.Router()


router.get("/proyectos", (req,res)=>{
    res.send("Aquí están los proyectos guardados en nuestra BD")
})

module.exports=router;