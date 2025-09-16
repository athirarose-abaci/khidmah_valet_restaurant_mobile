import { authAxios, publicAxios } from "../context/AxiosContext";

 //************ USER LOGIN ************ //
 export const userLogin = async(email, password)=>{
    const payload = {
        username: email,
        password: password,
        version_code:'1.0.0',
    }
    try{
        const response = await publicAxios.post('users/login/',payload);
        return response.data;
    }catch(error){
        throw error;
    }
}

//************ RESET PASSWORD ************ //
export const resetPassword = async(username, current_password, new_password)=>{
    const payload = {
        username: username,
        current_password: current_password,
        new_password: new_password,
    }
    try{
        const response = await publicAxios.post('users/reset-password/',payload);
        return response.data;
    }catch(error){
        throw error;
    }
}

//************ FORGOT PASSWORD ************ //


//************ USER PROFILE ************ //
export const userProfile = async() => {
    try{
        const response = await authAxios.get('users/profile/');
        console.log('userProfileResponse',response)
        return response.data;
    }catch(error){
        throw error;
    }
}

//************ UPDATE PROFILE ************ //
const updateProfile = async (payload) => {
    try{
        const response = await authAxios.patch('users/profile/',payload);
        return response.data;
    }catch(error){
        throw error;
    }
}


//*********************// USER LOGOUT //*********************//
export const logoutUser = async () => {
    try {
      const response = await authAxios.post('users/logout/');
      return response.data;
    } catch (error) {
      throw error;
    }
  };