import { configureStore } from "@reduxjs/toolkit";
import { cartApi } from "./apis/cart.api";
import cartSlice from "./slices/cart.slice";

const reduxStore = configureStore({
    reducer: {
        [cartApi.reducerPath]: cartApi.reducer,
        cart: cartSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cartApi.middleware)
})

export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export default reduxStore