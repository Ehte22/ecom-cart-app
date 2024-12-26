import { IProduct } from "./product.interface"

export interface ICart {
    _id?: string
    userId: string
    productId: IProduct
    quantity?: number
}

export interface ICartItems {
    cartItemData: ICart[]
    totalAmount: number
}
