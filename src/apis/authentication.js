
 //************ USER LOGIN ************ //

import axios from "axios";

 export const userLogin=async(email,password)=>{
    const payload={
        email: email,
        password: password,
        version_code:'1.0.0'
    }
    try{
        const response=await axios.post('users/login/',payload);
        console.log('loginResponse',response)
        return response.data;
    }catch(error){
        throw error;
    }
}