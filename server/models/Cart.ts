import mongoose, { Model, Schema } from "mongoose"

export interface ICart {
    userId: mongoose.Schema.Types.ObjectId
    productId: mongoose.Schema.Types.ObjectId
    quantity: number
}

const cartSchema = new Schema<ICart>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "product"
    },
    quantity: {
        type: Number,
        min: 1,
        default: 1
    }

}, { timestamps: true })

export const Cart: Model<ICart> = mongoose.model<ICart>("cart", cartSchema)