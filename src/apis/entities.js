import moment from "moment";
import { authAxios } from "../context/AxiosContext";

export const transactionHistory = async (entityId, pageNumber, searchQuery = '', limit, dateRange) => {
    try{
        const offset = limit * (pageNumber - 1);
        let url = `entities/transactions/?limit=${limit}&offset=${offset}&page=${pageNumber}&search=${searchQuery!=='null' ? searchQuery : ''}`;

        if(dateRange){
            const endDate = new Date(dateRange.endDate);
            endDate.setDate(endDate.getDate() + 1);
            const nextDay = endDate.toISOString().split('T')[0];   
            url = url+`&start_date=${dateRange.startDate} 00:00&end_date=${nextDay} 00:00`
        }
        console.log(url, "url from transaction history api")
        const response = await authAxios.get(url);
        return response.data;
    }catch(error){
        throw error;
    }
}

export const transactionHistoryDetails = async (txnId) => {
    try {
        const response = await authAxios.get(`entities/transactions/${txnId}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const transactionSummary = async (entityId, todayStart, todayEnd) => {
    try {
        const response = await authAxios.get(`entities/${entityId}/transaction-summary/?start_date=${todayStart}&end_date=${todayEnd}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deliveryValetPoints = async () => {
    try {
        const response = await authAxios.get('entities/allowed-delivery-valet-points/');
        return response.data;
    } catch (error) {
        throw error;
    }
}