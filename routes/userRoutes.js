const express=require("exprees");
const userController=require("../controllers/userController");
const routes=express.Router();

routes.post("/login",userController.loginUser);
routes.post("/register",userController.registerUser);
routes.post("/login/updateprofile",userController.updatePass);