export class Product{
    private productId: number;
    private productTitle: string;
    private productPrice: number;
    private productQuantity: number = 0;
    private productImage: string;
    private productCategory: string;

    constructor(data: any) {
        this.productId = data.productId;
        this.productTitle = data.productTitle;
        this.productPrice = data.productPrice;
        this.productQuantity = data.productQuantity;
        this.productImage = data.productImage;
        this.productCategory = data.productCategory;
      }

    public getProductId(): number {
        return this.productId;
    }
    
    public setProductId(productId: number): void {
        this.productId = productId;
    }

    public getProductTitle(): string {
        return this.productTitle;
    }

    public setProductTitle(productTitle: string): void {
        this.productTitle = productTitle;
    }

    public getProductPrice(): number {
        return this.productPrice;
    }

    public setProductPrice(productPrice: number): void {
        this.productPrice = productPrice;
    }

    public getProductQuantity(): number {
        return this.productQuantity;
    }

    public setProductQuantity(productQuantity: number): void {
        this.productQuantity = productQuantity;
    }

    public getProductImage(): string {
        return this.productImage;
    }

    public setProductImage(productImage: string): void {
        this.productImage = productImage;
    }

    public getProductCategory(): string {
        return this.productCategory;
    }

    public setProductCategory(productCategory: string): void {
        this.productCategory = productCategory;
    }
}