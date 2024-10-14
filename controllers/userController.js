const userModel=require("../models/user");
const bcrypt=require("bcrypt");

//Register a user
const registerUser=async(req,res)=>{
const {name,age,email,mobile,address,adharcardnumber,password,role}=req.body;
try {
    const user=await userModel.userByGmail(email);
    if(user) return res.send("User does exist!").json({message:"Try with another gmail"});
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(password,salt);

    //Creating User and inserting in database by the help of createUser function
    const newUser=await userModel.createUser(name,age,email,mobile,address,adharcardnumber,hashPassword,role);

    //Adding session to register user and setting cookie
    req.session.userId=newUser.rows[0].id;
    res.cookie("userId",newUser.rows[0].id,{httpOnly:true});
    res.status(201).json({message:"user registered successfull"});
} catch (error) {
    res.send(404).json({error:"Invalid input!"});
}
}

//login user
const loginUser=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const user=await userModel.userByGmail(email);
        const isMatch=await userModel.comparePass(password,user.password);
        if(!user || !isMatch) return res.send("Invalid username or password!").json({message:"Password Or username might be wrong"});
        
        //Adding session and setting cookies
        req.session.userId=user.id;
        req.session.save((err)=>{
            if(err){
                res.send(500).json({message:"Session saving error",error:err});
            }
            res.cookie("userId",newUser.id,{
                httpOnly:true,
                maxAge:1000*60*60*24,
                secure:process.env.PG_SEC,
                sameSite:"strict"
            })
        })
        res.cookie("userId",user.id,{httpOnly:true});
        res.status(200).json({message:"Login successfull"});
    } catch (error) {
        res.send(404).json({error:"Invalid input!"});
    }
   
}

//Upgrade password
const updatePass=async(req,res)=>{
    const {userId,currentPass,newPass}=req.body;
    try {
        const user=await userModel.userrId(userId);
        if(!user) return res.send("User not found!").json({message:"ReEnter the username"});
        const isMatch=await userModel.comparePass(currentPass,user.password);
        if(!isMatch) return res.send("Current password is wrong!")
        else{
            const salt=await  bcrypt.genSalt(10);
            const hashPassword=await  bcrypt.hash(newPass,salt);
            await userModel.updatePass(hashPassword,userId);
            res.status(200).json({message:"Password Saved sucessfull"});
        }
        
    } catch (error) {
        res.send(404).json({error:"Invalid input!"});
    }
}

module.exports={
    registerUser,
    loginUser,
    updatePass
};