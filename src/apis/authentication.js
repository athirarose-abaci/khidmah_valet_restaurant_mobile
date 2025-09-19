import { authAxios, publicAxios } from "../context/AxiosContext";

//*********************// SYSTEM STATUS //*********************//
export const checkSystemStatus = async () => {
    try {
      const response = await publicAxios.get('system/status/');
      return {
        success: response.data.status === 'success',
        adminUsersExist: response.data.details?.admin_users_exist || false,
      };
    } catch (error) {
      return {
        success: false,
        adminUsersExist: false,
      };
    }
  };

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





//************ CHANGE PASSWORD ************ //
export const changePassword = async (payload) => {

    console.log('changePasswordPayload', payload);
    try {
      const response = await authAxios.post('users/reset-password/', payload);
      return response;
    } catch (error) {
      throw error;
    }
  };

//************ USER PROFILE ************ //
export const userProfile = async() => {
    try{
        const response = await authAxios.get('users/profile/');
        return response.data;
    }catch(error){
        throw error;
    }
}

//************ UPDATE PROFILE ************ //
export const updateUserProfile = async (payload) => {
    try{
        const response = await authAxios.patch('users/profile/',payload);
        console.log('updateUserProfileResponse',response)
        return response;
    }catch(error){
        throw error;
    }
}


//*********************// USER LOGOUT //*********************//
export const logoutUser = async () => {
    try {
      const response = await authAxios.post('users/logout/');
      console.log('logoutUserResponse',response)
      return response.data;
    } catch (error) {
      throw error;
    }
  };