const userModel=require("../models/user");

const bcrypt=require("bcrypt");

//Register a user
const registerUser=async(req,res)=>{
const {name,age,email,mobile,address,adharcardnumber,password,role}=req.body;
try {
    const user=await userModel.userByGmail(email);
    if(user) return res.status(400).send('User already exists');
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(password,salt);

    //Creating User and inserting in database by the help of createUser function
    const newUser=await userModel.createUser(name,age,email,mobile,address,adharcardnumber,hashPassword,role);

    //Adding session to register user and setting cookie
    req.session.userId=newUser.id;
    res.cookie("userId",newUser.id,{httpOnly:true});
    res.status(201).json({message:"user registered successfull"});
} catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
}
}

//login user
const loginUser=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const user=await userModel.userByGmail(email);
        const isMatch=await userModel.comparePass(password,user.password);
        if(!user || !isMatch) res.status(404).send('User not found!');
        
        //Adding session and setting cookies
        req.session.userId=user.id;
        req.session.save((err)=>{
            if(err){
              return  res.status(500).send('Session not saved');
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
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
   
}

//user profile
const userProfile=async(req,res)=>{
    try {
        const userId=req.session.userId;
        if(!userId) return res.status(404).send('User session expire');
        const user=await userModel.userrId(userId);
        if(!user) res.status(404).send('User not exists');
        const {name,age,email,mobile,address,adharcardnumber,role}=user;
        res.send(200).json({
            name,age,email,mobile,address,adharcardnumber,role
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
        
    }
   
}

//Upgrade password
const updatePass=async(req,res)=>{
    const {userId,currentPass,newPass}=req.body;
    try {
        const user=await userModel.userrId(userId);
        if(!user) res.status(404).send('User not exists');
        const isMatch=await userModel.comparePass(currentPass,user.password);
        if(!isMatch) res.status(201).send('Password is wrong!');
        else{
            const salt=await  bcrypt.genSalt(10);
            const hashPassword=await  bcrypt.hash(newPass,salt);
            await userModel.updatePass(hashPassword,userId);
            res.status(200).json({message:"Password Saved sucessfull"});
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

module.exports={
    registerUser,
    loginUser,
    updatePass,
    userProfile
};