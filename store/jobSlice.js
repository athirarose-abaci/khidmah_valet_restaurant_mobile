import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        entityDetails: [],
        entityValidationDetails: [],
        currentNfcId: null,
    },
    reducers: {
        setEntityDetails: (state, action) => {
            state.entityDetails = action.payload;
        },
        setEntityValidationDetails: (state, action) => {
            state.entityValidationDetails = action.payload;
        },
        clearEntityDetails: (state) => {
            state.entityDetails = [];
        },
        clearEntityValidationDetails: (state) => {
            state.entityValidationDetails = [];
        },
        setCurrentNfcId: (state, action) => {
            state.currentNfcId = action.payload;
        },
        clearCurrentNfcId: (state) => {
            state.currentNfcId = null;
        },
    }
});

export const {
    setEntityDetails,
    setEntityValidationDetails,
    clearEntityDetails,
    clearEntityValidationDetails,
    setCurrentNfcId,
    clearCurrentNfcId,
} = jobSlice.actions;
export default jobSlice.reducer;