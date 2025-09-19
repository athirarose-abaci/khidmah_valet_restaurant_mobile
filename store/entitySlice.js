import { createSlice } from "@reduxjs/toolkit";

const entitySlice = createSlice({
    name: 'entities',
    initialState: {
        paymentHistory: [],
        formattedPaymentHistory: [],
        formattedRecentActivity: [],
    },
    reducers: {
        setPaymentHistory: (state, action) => {
            state.paymentHistory = action.payload;
        },
        formattedPaymentHistory: (state, action) => {
            state.formattedPaymentHistory = action.payload;
        },
        formattedRecentActivity: (state, action) => {
            state.formattedRecentActivity = action.payload;
        },
        clearPaymentHistory: (state) => {
            state.paymentHistory = [];
            state.formattedPaymentHistory = [];
            state.formattedRecentActivity = [];
        },
    }
});

export const { setPaymentHistory, clearPaymentHistory, formattedPaymentHistory, formattedRecentActivity } = entitySlice.actions;
export default entitySlice.reducer;