const pool=require("../config/db");
const bcrypt = require('bcrypt');

//Add new user (hashed password)
const createUser= async({name,age,email,mobile,address,adharcardnumber,password,role})=>{
    try {
        

        const result=pool.query("INSERT (name,age,email,mobile,address,adharcardnumber,hashPassword,role) INTO user VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",[name,age,email,mobile,address,adharcardnumber,hashPassword,role]);

        return result.row[0];

    } catch (err) {
        throw(err).json({message:"Complete the details!"});
    } 
}

//find user by id
const userrId=async (id)=>{
try {
    const result=await pool.query("SELECT * FROM user WHERE id=$1",[id]);
    return result.rows[0];
} catch (error) {
    
}
}
//Update password
const updatePassword=async(id,newPass)=>{
try {
    const result=await pool.query("UPDATE users SET password=$1 WHERE id=$2 RETURING *",[newPass,id]);
    return result.rows[0];
} catch (error) {
    throw (error)
}
}

//Find user by gmail
const userByGmail=async(email)=>{
    
    try {
        const userGmail=await pool.query("SELECT * FROM users WHERE email=$1",[email]);
    return result.row[0];
    } catch (err) {
        throw err
    }
}

//Compare password with hash password

const comparePass= async (enteredPassword, storedPasswordHash) => {
    try {
     const isMatch =  await bcrypt.compare(enteredPassword, storedPasswordHash);
       return isMatch;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw error;
    }
  };
  

module.exports={
    createUser,
    userrId,
    userByGmail,
    comparePass,
    updatePassword
}