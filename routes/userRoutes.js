const express=require("express");
const userController=require("../controllers/userController");
const route=express.Router();

route.post("/login",userController.loginUser);
route.post("/register",userController.registerUser);
route.get("/profile",userController.userProfile);
route.put("/profile/password",userController.updatePass);

module.exports=route;