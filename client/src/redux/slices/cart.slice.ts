import { createSlice } from "@reduxjs/toolkit";
import { ICartItems } from "../../models/cart.interface";

interface InitialState {
    cartItems: ICartItems | null
}

const initialState: InitialState = {
    cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems") as string)
        : []
}
const cartSlice = createSlice({
    name: "cartSlice",
    initialState,
    reducers: {
        setCartItem(state, { payload }) {
            state.cartItems = payload
            localStorage.setItem("cartItems", JSON.stringify(payload))
        },
        removeCartItems(state) {
            state.cartItems = null
            localStorage.removeItem("cartItems")
        },

    },
    extraReducers: builder => builder

})

export const { setCartItem, removeCartItems } = cartSlice.actions
export default cartSlice.reducer

export type { InitialState }
