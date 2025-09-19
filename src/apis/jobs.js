import { authAxios } from "../context/AxiosContext";

export const parkingValidationDetails = async (nfc_id) => {
    try{
        const response = await authAxios.post(`jobs/jobs/${nfc_id}/entity-parking-validation/`);
        console.log('response', response);
        return response.data;
    }catch(error){
        throw error;
    }
}

export const parkingValidation = async (nfc_id) => {
    const payload = {
        is_confirm: true,
    }
    try{
        const response = await authAxios.post(`jobs/jobs/${nfc_id}/entity-parking-validation/`, payload);
        return response;
    }catch(error){
        throw error;
    }
}