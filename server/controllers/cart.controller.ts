import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { Cart } from "../models/Cart"
import { generateCorrelationId } from "../utils/corelationId"
import { MSG_PRODUCER } from "../utils/messageProducer"
import { MSG_CONSUMER } from "../utils/messageConsumer"
import { PRODUCT_REQUEST, PRODUCT_RESPONSE, channel } from "../services/rabbitMQ.service"

export const getCartItems = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const cartItems = await Cart.find({ userId: req.body.userId })

    if (!cartItems.length) {
        return res.status(200).json({ message: "No items in the cart", result: [] });
    }

    const productIds = cartItems.map((item) => item.productId.toString())

    const correlationId = generateCorrelationId()
    MSG_PRODUCER(channel, PRODUCT_REQUEST, { productIds }, correlationId)

    const productsDetails = await MSG_CONSUMER(channel, PRODUCT_RESPONSE, correlationId)
    const result = cartItems.map((item) => ({
        ...item.toObject(),
        productId: productsDetails.find((prod: any) => prod._id === item.productId.toString()),
    }));
    res.status(200).json({ message: "Cart Items Fetch Successfully", result })
})

export const addCartItem = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { userId, productId, quantity } = req.body
    const cartItem = await Cart.findOne({ userId, productId })

    if (cartItem) {
        await Cart.findByIdAndUpdate(cartItem._id, { $inc: { quantity: 1 } })
    } else {
        await Cart.create({ userId, productId, quantity })
    }
    res.status(200).json({ message: "Cart Item Add Successfully" })

})

export const updateCartItem = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { action } = req.body;
    console.log(action);


    const cartItem = await Cart.findById(id);

    if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
    }

    let updatedQuantity = cartItem.quantity;

    if (action === "increment") {
        updatedQuantity += 1;
    } else if (action === "decrement") {
        if (cartItem.quantity > 1) {
            updatedQuantity -= 1;
        } else {
            return res.status(400).json({ message: "Minimum quantity of 1 is required" });
        }
    } else {
        return res.status(400).json({ message: "Invalid action" });
    }

    const updatedCartItem = await Cart.findByIdAndUpdate(
        id,
        { quantity: updatedQuantity },
        { new: true }
    );

    res.status(200).json({ message: "Cart item updated successfully", updatedCartItem });
});


export const deleteCartItem = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
    await Cart.findByIdAndDelete(id)
    res.status(200).json({ message: "Cart Item Remove Successfully" })
})

export const deleteAllCartItems = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    await Cart.deleteMany({ userId: req.body.userId })
    res.status(200).json({ message: "Cart Items Remove Successfully" })
})