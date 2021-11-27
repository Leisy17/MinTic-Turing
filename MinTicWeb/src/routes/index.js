const express=require("express")

const router=express.Router()

router.get("/", (req,res)=>{
    res.send("Hola mundo")
})
router.get("/aboutus",(req,res)=>{
    res.send("Esto es acerca de nosotros")
})
module.exports=router;