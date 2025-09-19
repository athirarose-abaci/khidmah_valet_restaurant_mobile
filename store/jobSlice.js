import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        entityDetails: [],
        entityValidationDetails: [],
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
    }
});

export const { setEntityDetails, setEntityValidationDetails, clearEntityDetails, clearEntityValidationDetails } = jobSlice.actions;
export default jobSlice.reducer;