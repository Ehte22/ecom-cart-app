import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useAddOrderMutation } from "order/redux/order.api"
import { toast } from "../services/toast";
import { useNavigate } from "react-router-dom";
import { removeCartItems } from "../redux/slices/cart.slice";
import { useDeleteCartsMutation } from "../redux/apis/cart.api";

const Checkout = () => {
    const [placeOrder, { data: placeOrderMessage, isSuccess }] = useAddOrderMutation()
    const [deleteCarts] = useDeleteCartsMutation()
    const { cartItems } = useSelector((state: RootState) => state.cart)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const orderSchema = z.object({
        fullName: z.string().min(1, "Full Name is required").max(50, "Full Name is too long"),
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zipCode: z.string()
            .min(5, "Zip Code must be at least 5 characters")
            .max(10, "Zip Code must be at most 10 characters")
            .regex(/^\d+$/, "Zip Code must be numeric"),
    });

    type FormValues = z.infer<typeof orderSchema>;

    const { register, handleSubmit, formState: { errors }, reset, getValues, trigger } = useForm<FormValues>({
        resolver: zodResolver(orderSchema),
        mode: "onChange",
    });

    const [isAddressSaved, setIsAddressSaved] = useState(false);

    const handleReset = () => {
        reset();
        setIsAddressSaved(false);
    };

    const formValues = getValues();

    const handleSaveAddress = async () => {
        const isFormValid = await trigger();

        if (isFormValid) {
            const values = getValues();
            const isAddressFilled = Object.values(values).every((value) => value !== "");

            if (isAddressFilled) {
                setIsAddressSaved(true);
            }
        }
    };

    const onSubmit = (values: FormValues) => {
        if (cartItems) {
            placeOrder({
                shippingDetails: values,
                products: cartItems.cartItemData,
                totalAmount: cartItems.totalAmount
            })
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.showSuccess(placeOrderMessage)
            navigate("/order/success")
            dispatch(removeCartItems())
            deleteCarts()
        }
    }, [isSuccess])


    return (
        <div className="md:px-12 lg:px-20">
            <div className="container mx-auto p-6 my-10">
                <h1 className="text-2xl font-bold mb-6">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full p-2 border rounded"
                                    {...register("fullName")}
                                />
                                <p className="text-red-600 text-sm mt-1">{errors.fullName?.message}</p>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Address"
                                    className="w-full p-2 border rounded"
                                    {...register("address")}
                                />
                                <p className="text-red-600 text-sm mt-1">{errors.address?.message}</p>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="w-full p-2 border rounded"
                                    {...register("city")}
                                />
                                <p className="text-red-600 text-sm mt-1">{errors.city?.message}</p>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="State"
                                    className="w-full p-2 border rounded"
                                    {...register("state")}
                                />
                                <p className="text-red-600 text-sm mt-1">{errors.state?.message}</p>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Zip Code"
                                    className="w-full p-2 border rounded"
                                    {...register("zipCode")}
                                />
                                <p className="text-red-600 text-sm mt-1">{errors.zipCode?.message}</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    className="bg-teal-700 text-white py-1 px-4 rounded"
                                    onClick={handleSaveAddress}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-1 px-4 rounded"
                                    onClick={handleReset}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold my-4">Payment Option</h2>
                        <div className="p-4 bg-white border rounded">
                            <label className="flex items-center space-x-2">
                                <input type="radio" checked readOnly className="form-radio" />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className={`mt-6 w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded ${!isAddressSaved ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={!isAddressSaved}
                        >
                            Place Order
                        </button>
                    </form>

                    <div className="bg-gray-100 p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-lg font-semibold">Shipping Information</h3>
                            <p><strong>Full Name:</strong> {formValues.fullName}</p>
                            <p><strong>Address:</strong> {formValues.address}</p>
                            <p><strong>City:</strong> {formValues.city}</p>
                            <p><strong>State:</strong> {formValues.state}</p>
                            <p><strong>Zip Code:</strong> {formValues.zipCode}</p>
                        </div>

                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-lg font-semibold">Payment Option</h3>
                            <p>Cash on Delivery</p>
                        </div>

                        <div className="text-lg font-bold">
                            <p>Total: ${cartItems?.totalAmount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
