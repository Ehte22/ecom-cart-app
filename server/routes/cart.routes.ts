import express from "express"
import * as cartController from "../controllers/cart.controller"

const CART_ROUTER = express.Router()

CART_ROUTER
    .get("/", cartController.getCartItems)
    .post("/add-cartItem", cartController.addCartItem)
    .put("/update-cartItem/:id", cartController.updateCartItem)
    .delete("/delete-cartItem/:id", cartController.deleteCartItem)
    .delete("/delete-carts", cartController.deleteAllCartItems)

export default CART_ROUTER