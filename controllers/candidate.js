const candidateModel=require("../models/candidate");
const userModel=require("../models/user");
//check if user is admin
const checkIsAdmin=async(email)=>{
    try {
        const user=await userModel.userByGmail(email);
        if(user.role==="admin") return true;
    } catch (error) {
        return false;
    }
  

}

//Create a new candidate
const createCandidate=async(req,res)=>{
    if(!await checkIsAdmin(req.user.email)){
        console.log("admin role not found");
        return res.status(403).json({message:"User doesn't have admin role"})
    } else console.log("admin role found!");

    const {name,party,age}=req.body;
    try {
    const candidateExist=await candidateModel.candExist(name,party);
    if(candidateExist) return res.status(201).send("Candidate with same name and party already exist");
    const createCandi=await candidateModel.newCandidate(name,party,age);
    return res.status(201).send("Sucessfully created!");
    } catch (error) {
        console.log(error);
        return res.status(404).send("Invalid inteval!");
    }
}

const deleteCand=async(req,res)=>{
    const {id}=req.params;
    try {
    const user=await candidateModel.candByid(id);
    if(!user) return res.status(404).send("User does not exist!");
    await candidateModel.deleteId(user);
    return res.status(200).send("Deleted sucessfull!");
    } catch (error) {
        console.error("Error detecting while deleting:", error);
        return res.status(500).send("An error occurred while deleting the candidate.");
    }
}

const updateCandidate=async(req,res)=>{
    try {
     const {id}=req.params;
     const {name,party,age}=req.body;
     const user=candidateModel.candByid(id);
     if(!user) return res.status(206).send("User doesn't exist!");
     const result=candidateModel.updateCand(name,party,age);
     return result.rows[0];
    } catch (error) {
    console("Update Candidate function does not work");
    return res.status(593).send(error);
    }
}

const renderAllCandidate=async(req,res)=>{
const candidates=candidateModel.showCandi();
if(!candidates) return res.status(404).send("There are no candidates!");
res.status(200).json({
    message:"Render sucessfull",
    data:candidates
});
}

module.exports={
    renderAllCandidate,
    updateCandidate,
    deleteCand,
    createCandidate
}