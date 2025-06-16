import { ShoppingCart } from './ShoppingCart';

export interface DeliveryAddress {
    lat?: number;
    lng?: number;
    description: string;
}

export class Order {
    private orderId: string;
    private userId: string;
    private items: ShoppingCart;
    private paymentMethod: string;
    private deliveryAddress: DeliveryAddress;
    private shippingFee: number;
    private totalPrice: number;
    private createdAt: Date;

    constructor(
        userId: string,
        items: ShoppingCart,
        paymentMethod: string,
        deliveryAddress: DeliveryAddress,
        shippingFee: number,
        totalPrice: number
    ) {
        this.orderId = this.generateOrderId();
        this.userId = userId;
        this.items = items;
        this.paymentMethod = paymentMethod;
        this.deliveryAddress = deliveryAddress;
        this.shippingFee = shippingFee;
        this.totalPrice = totalPrice;
        this.createdAt = new Date();
    }

    private generateOrderId(): string {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 6);
        return `ORD-${timestamp}-${randomStr}`;
    }

    public getOrderId(): string {
        return this.orderId;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getItems(): ShoppingCart {
        return this.items;
    }

    public getPaymentMethod(): string {
        return this.paymentMethod;
    }

    public getDeliveryAddress(): DeliveryAddress {
        return this.deliveryAddress;
    }

    public getShippingFee(): number {
        return this.shippingFee;
    }

    public getTotalPrice(): number {
        return this.totalPrice;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public setUserId(userId: string): void {
        this.userId = userId;
    }

    public setItems(items: ShoppingCart): void {
        this.items = items;
    }

    public setPaymentMethod(paymentMethod: string): void {
        this.paymentMethod = paymentMethod;
    }

    public setDeliveryAddress(deliveryAddress: DeliveryAddress): void {
        this.deliveryAddress = deliveryAddress;
    }

    public setShippingFee(shippingFee: number): void {
        this.shippingFee = shippingFee;
    }

    public setTotalPrice(totalPrice: number): void {
        this.totalPrice = totalPrice;
    }

    public setCreatedAt(createdAt: Date): void {
        this.createdAt = createdAt;
    }
}
