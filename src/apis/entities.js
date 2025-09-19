import moment from "moment";
import { authAxios } from "../context/AxiosContext";

export const transactionHistory = async (entityId, pageNumber, searchQuery = '', limit, dateRange) => {
    try{
        const offset = limit * (pageNumber - 1);
        let url = `entities/${entityId}/transactions/?limit=${limit}&offset=${offset}&page=${pageNumber}`;
        if(searchQuery){
            url += `&search=${searchQuery}`;
        }
        if(dateRange){
            const startDate = moment(dateRange.startDate).format('YYYY-MM-DD');
            const endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
            url += `&start_date=${startDate}&end_date=${endDate}`;
        }
        const response = await authAxios.get(url);
        return response.data;
    }catch(error){
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