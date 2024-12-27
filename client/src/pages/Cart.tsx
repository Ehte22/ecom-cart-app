import React, { useEffect, useState } from 'react';
import { useDeleteCartItemMutation, useGetCartItemsQuery } from '../redux/apis/cart.api';
import { toast } from '../services/toast';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItem } from '../redux/slices/cart.slice';
import { RootState } from '../redux/store';
import { ICart } from '../models/cart.interface';

const Cart = () => {
    const { data: cartData, isLoading } = useGetCartItemsQuery();
    const [removeCartItem, { data: removeMessage, isSuccess: isRemoveSuccess }] = useDeleteCartItemMutation();
    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [subTotalAmount, setSubTotalAmount] = useState<number>(0);
    const [tax, setTax] = useState<number>(0);
    const dispatch = useDispatch()
    const { cartItems } = useSelector((state: RootState) => state.cart)
    const [cartAllItems, setCartAllItems] = useState<ICart[]>([])

    const handleCheckout = () => {
        dispatch(setCartItem({ cartItemData: cartAllItems, totalAmount }))
        navigate(`/cart/checkout`)
    }

    const handleQtyInc = (id: string) => {
        if (cartAllItems.length > 0) {
            const updatedCartItems = cartAllItems.map((item) =>
                item._id === id
                    ? { ...item, quantity: (item.quantity || 0) + 1 }
                    : item
            );

            setCartAllItems(updatedCartItems);
        }

    };

    const handleQtyDec = (id: string) => {
        if (cartAllItems.length > 0) {
            const updatedCartItems = cartAllItems.map((item) =>
                item._id === id
                    ? { ...item, quantity: (item.quantity || 0) - 1 }
                    : item
            );

            setCartAllItems(updatedCartItems);
        }
    }

    // Calculate totals whenever cartItemData change
    useEffect(() => {
        if (cartAllItems.length > 0) {
            const subtotal = cartAllItems.reduce(
                (sum, item) => sum + +item.productId.price * (item.quantity as number),
                0
            );
            setSubTotalAmount(subtotal)
            const calculateTax = subtotal / 100 * 18

            setTax(calculateTax)
            const newTotalAmount = subtotal + calculateTax
            setTotalAmount(Number(newTotalAmount));
        }
    }, [cartAllItems]);


    useEffect(() => {
        if (isRemoveSuccess) {
            toast.showSuccess(removeMessage);
            if (cartData) {
                setCartAllItems(cartData?.result)
            }
        }
    }, [isRemoveSuccess, removeMessage, cartData]);

    useEffect(() => {
        if (cartItems?.cartItemData) {
            setCartAllItems(cartItems.cartItemData);
        }
    }, [cartItems]);

    useEffect(() => {
        if (cartData) {
            setCartAllItems(cartData?.result)
        }
    }, [cartData])


    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen md:px-12 lg:px-20">
            <div className="container mx-auto my-10">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">My Cart</h1>

                {cartAllItems.length === 0 ? (
                    <p className="text-xl text-center text-gray-600">Your cart is empty!</p>
                ) : (
                    <div className="flex flex-wrap lg:flex-nowrap gap-12">
                        {/* Left Side: Cart Items */}
                        <div className="w-full lg:w-8/12">
                            <div className="space-y-6">
                                {cartAllItems.length > 0 && cartAllItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center bg-white shadow-md rounded-lg p-4"
                                    >
                                        {/* Product Image */}
                                        <div className="w-24 h-24 flex-shrink-0">
                                            <img
                                                src={item.productId.image}
                                                alt={item.productId.name}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="ml-6 flex-1">
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {item.productId.name}
                                            </h2>
                                            <p className="text-gray-500 text-lg">
                                                ${item.productId.price}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center mt-4">
                                                <button
                                                    className="w-8 h-8 bg-gray-200 text-gray-800 rounded-md flex items-center justify-center font-bold"
                                                    disabled={item.quantity as number <= 1}
                                                    onClick={() => handleQtyDec(item._id as string)}
                                                >
                                                    -
                                                </button>
                                                <span className="mx-4 text-lg font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="w-8 h-8 bg-teal-600 text-white rounded-md flex items-center justify-center font-bold"
                                                    onClick={() => handleQtyInc(item._id as string)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total for Item */}
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-800">
                                                ${(+item.productId.price * (item.quantity as number)).toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() => removeCartItem(item._id as string)}
                                                className="text-red-600 text-sm underline mt-2"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Summary Card */}
                        <div className="w-full lg:w-4/12">
                            <div className="p-6 bg-white shadow-lg rounded-lg">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                    Order Summary
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span>${subTotalAmount.toFixed(2)}</span> {/* Show totalAmount here */}
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-600">Tax</span>
                                        <span>${tax.toFixed(2)}</span> {/* Show tax */}
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>${totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="mt-8 w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-lg text-lg font-medium">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
