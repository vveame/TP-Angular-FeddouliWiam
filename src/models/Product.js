"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var Product = /** @class */ (function () {
    function Product(productId, productTitle, productPrice) {
        this.productId = productId;
        this.productTitle = productTitle;
        this.productPrice = productPrice;
    }
    Product.prototype.printProduct = function () {
        return "Product ID: ".concat(this.productId, ", Title: ").concat(this.productTitle, ", Price: ").concat(this.productPrice);
    };
    Product.prototype.getProductId = function () {
        return this.productId;
    };
    Product.prototype.setProductId = function (productId) {
        this.productId = productId;
    };
    Product.prototype.getProductTitle = function () {
        return this.productTitle;
    };
    Product.prototype.setProductTitle = function (productTitle) {
        this.productTitle = productTitle;
    };
    Product.prototype.getProductPrice = function () {
        return this.productPrice;
    };
    Product.prototype.setProductPrice = function (productPrice) {
        this.productPrice = productPrice;
    };
    return Product;
}());
exports.Product = Product;
