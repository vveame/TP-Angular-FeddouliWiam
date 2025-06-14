import { Product } from './Product';

export interface ShoppingCartItem {
    itemProduct: Product;
    quantity: number;
}