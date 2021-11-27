const express=require("express")

const router=express.Router()

router.get("/usuarios/signup", (req,res)=>{
    res.send("Aquí te vas a registrar")
})
router.get("/usuarios/signin",(req,res)=>{
    res.send("Aquí inicias sesión")
})
module.exports=router;