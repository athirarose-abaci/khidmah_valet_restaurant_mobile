import { authAxios } from "../context/AxiosContext";

export const parkingValidationDetails = async (nfc_id) => {
    try{
        const response = await authAxios.post(`jobs/jobs/${nfc_id}/entity-parking-validation/`);
        console.log(response,'response');
        return response.data;
    }catch(error){
        console.log(error,'error');
        throw error;
    }
}

export const parkingValidation = async (nfc_id) => {
    const payload = {
        is_confirm: true,
    }
    console.log(payload,'payload');
    console.log(nfc_id,'nfc_id');
    try{
        const response = await authAxios.post(`jobs/jobs/${nfc_id}/entity-parking-validation/`, payload);
        return response.data;
    }catch(error){
        throw error;
    }
}

export const transactionHistory = async (id) => {
    try{
        const response = await authAxios.get(`jobs/jobs/${id}/transactions/`);
        return response.data;
    }catch(error){
        throw error;
    }
}

