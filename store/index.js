import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import themeSlice from "./themeSlice";
import entitySlice from "./entitySlice";
import jobSlice from "./jobSlice";

const store = configureStore({
    reducer : {
        authSlice : authSlice,
        themeSlice : themeSlice,
        entitySlice : entitySlice,
        jobSlice : jobSlice,
    }
})

export default store;