import { ShoppingCartItem } from "./ShoppingCartItem";

export interface ShoppingCart {
    itemsProduct: ShoppingCartItem[];
    totalItems: number;
    totalPrice: number;
}