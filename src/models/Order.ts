import { ShoppingCart } from './ShoppingCart';

export interface DeliveryAddress {
    lat?: number;
    lng?: number;
    description: string;
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
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
    private status: OrderStatus;

    constructor(
        userId: string,
        items: ShoppingCart,
        paymentMethod: string,
        deliveryAddress: DeliveryAddress,
        shippingFee: number,
        totalPrice: number,
        status: OrderStatus = OrderStatus.PENDING
    ) {
        this.orderId = this.generateOrderId();
        this.userId = userId;
        this.items = items;
        this.paymentMethod = paymentMethod;
        this.deliveryAddress = deliveryAddress;
        this.shippingFee = shippingFee;
        this.totalPrice = totalPrice;
        this.createdAt = new Date();
        this.status = status;
    }

    public getStatus(): OrderStatus {
        return this.status;
    }

    public setStatus(status: OrderStatus): void {
        this.status = status;
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

    public toJSON(): any {
        return {
            orderId: this.orderId,
            userId: this.userId,
            items: this.items.itemsProduct.map(item => ({
                productId: item.itemProduct.getProductId(),
                quantity: item.quantity,
            })),
            paymentMethod: this.paymentMethod,
            deliveryAddress: this.deliveryAddress,
            shippingFee: this.shippingFee,
            totalPrice: this.totalPrice,
            createdAt: this.createdAt.toISOString(),
            status: this.status
        };
    }

    public static fromJSON(data: any): Order {
        const order = new Order(
            data.userId,
            data.items.map((item: any) => ({
                itemProduct: { getProductId: () => item.productId },
                quantity: item.quantity
            })),
            data.paymentMethod,
            data.deliveryAddress,
            data.shippingFee,
            data.totalPrice,
            data.status
        );
        const parsedDate = new Date(data.createdAt);
        order.setCreatedAt(isNaN(parsedDate.getTime()) ? new Date() : parsedDate);
        order['orderId'] = data.orderId;
        return order;
    }

}
