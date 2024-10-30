const express = require("express");
const candiController=require("../controllers/candidate");
const {jwtAuthMiddleware}=require("../middlewares/roleMiddleware");

const route=express.Router();

route.post("/create",jwtAuthMiddleware,candiController.createCandidate);
route.put("/:id",jwtAuthMiddleware,candiController.updateCandidate);
route.delete("/:id",candiController.deleteCand);
route.get("/",candiController.renderAllCandidate);

module.exports=route;