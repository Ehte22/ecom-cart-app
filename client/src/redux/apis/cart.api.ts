import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ICart } from "../../models/cart.interface"

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: fetchBaseQuery({
        // baseUrl: `${process.env.BASE_URL}/api/v1/cart`, credentials: "include", prepareHeaders(headers, { getState }) {
        baseUrl: `https://ecom-cart-app-server.vercel.app/api/v1/cart`, credentials: "include", prepareHeaders(headers, { getState }) {
            const state = getState() as any
            const token = state.auth.user?.token
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ["cart"],
    endpoints: (builder) => {
        return {
            getCartItems: builder.query<{ message: string, result: ICart[] }, void>({
                query: () => {
                    return {
                        url: "/",
                        method: "GET"
                    }
                },
                transformResponse: (data: { message: string, result: ICart[] }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["cart"]
            }),

            addCartItem: builder.mutation<string, string>({
                query: cartItemData => {
                    return {
                        url: "/add-cartItem",
                        method: "POST",
                        body: cartItemData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["cart"]
            }),

            updateCartItem: builder.mutation<string, { id: string, action: string }>({
                query: ({ id, action }) => {
                    return {
                        url: `/update-cartItem/${id}`,
                        method: "PUT",
                        body: { action }
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["cart"]
            }),

            deleteCartItem: builder.mutation<string, string>({
                query: (id) => {
                    return {
                        url: `/delete-cartItem/${id}`,
                        method: "DELETE",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["cart"]
            }),
            deleteCarts: builder.mutation<string, void>({
                query: () => {
                    return {
                        url: `/delete-carts`,
                        method: "DELETE",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["cart"]
            }),
        }
    }
})

export const {
    useGetCartItemsQuery,
    useAddCartItemMutation,
    useUpdateCartItemMutation,
    useDeleteCartItemMutation,
    useDeleteCartsMutation
} = cartApi
