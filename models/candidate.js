const pool=require("../config/db");

//Insert new candidate
const newCandidate=async(name,party,age)=>{
    try {
        const result=await pool.query("INSERT INTO candidates(name,party,age) VALUES($1,$2,$3) RETURNING *",[name,party,age]);
        return result.rows[0]; 
    } catch (error) {
        throw error;
    }
}

const deleteId=async(id)=>{
    try {
        const result=pool.query("DELETE FROM candidates WHERE id=$1 RETURNING *",[id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
    
}

const updateCand=async(id,name,party,age)=>{
try {
    const result=await pool.query("UPDATE candidates SET name=$1,party=$2,age=$3 WHERE id=$4 RETURNING *",[name,party,age,id]);
    return result.rows[0];
} catch (error) {
    throw error;
}
}

const candExist=async(name,party)=>{
    try {
        const result=await pool.query("SELECT * FROM candidates WHERE name=$1 AND party=$2",[name,party]);
       return result.rows[0];
    } catch (error) {
        throw error;
    }
}

const candByid=async(id)=>{
    const result=await pool.query("SELECT * FROM candidates WHERE id=$1",[id]);
    return result.rows[0]; 
}



const showCandi=async()=>{
    try {
    const result=pool.query("SELECT * FROM candidates");
    return result.rows[0];
    } catch (error) {
        throw error;
    }
    
}

//Increment vote count by 1  //id=candidate_id;
const IncrementVotes=async(id)=>{
    try {
        const result=await pool.query("UPDATE candidates SET vote_count=vote_count+1 WHERE id=$1 RETURNING *",[id]);
        console.log("The Increment vote",result);
        
        return result.rows[0];
    } catch (error) {
        console.error("IncrementVotes error in catch",error);
        throw error;
    }
    
}


module.exports={
    newCandidate,
    candExist,
    deleteId,
    updateCand,
    showCandi,
    candByid,
    IncrementVotes,
};