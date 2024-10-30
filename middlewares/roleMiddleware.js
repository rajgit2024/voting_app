const jwt=require("jsonwebtoken");

const jwtAuthMiddleware=(req,res,next)=>{
    const authorisation=req.headers.authorization;
    if(!authorisation) return res.send(401).json({message:"Token not found!"})
    const token=req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({error:"Unauthorized"});
    try {
        //Jo hamara encode token hai usko ye decode krega takki readable bna ske
        const decoded= jwt.verify(token,process.env.JWT_KEY);
        req.user=decoded
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({error:"Invalid token"});
    }
   
}

//Generate krte wakt humme user ka payload chahiye; payload=userdate
const generateToken=(userData)=>{
return jwt.sign(userData,process.env.JWT_KEY,{expiresIn:"1h"});
}

module.exports={
    jwtAuthMiddleware,
    generateToken
}