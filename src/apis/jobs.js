import { authAxios } from "../context/AxiosContext";

export const parkingValidationDetails = async (nfc_id) => {
    try{
        const response = await authAxios.post(`jobs/jobs/${nfc_id}/entity-parking-validation/`);
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

export const acceptDeliveryRequest = async (nfc_id, valet_point_id) => {
    const payload = {
        final_valet_point: valet_point_id,
    }
    try{
        const response = await authAxios.patch(`jobs/jobs/${nfc_id}/delivery-request/`, payload);
        return response;
    }catch(error){
        throw error;
    }
}