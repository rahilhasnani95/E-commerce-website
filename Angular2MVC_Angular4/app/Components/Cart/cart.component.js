"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_service_1 = require("../../Service/User/user.service");
var router_1 = require("@angular/router");
var auth_guard_1 = require("../../Components/Login/Guard/auth.guard");
var CartComponent = /** @class */ (function () {
    function CartComponent(_userService, authGuard, router) {
        this._userService = _userService;
        this.authGuard = authGuard;
        this.router = router;
        this.constTax = 0.08;
        this.shipping = 0.01;
        this.subTotalPrice = 0;
        this.loggedInUserDetails = this.authGuard.getUserAndUrlDetail();
    }
    CartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.allCartItems = JSON.parse(localStorage.getItem('cartItems'));
        if (this.allCartItems && this.allCartItems.filter(function (o) { return o.UserId == _this.loggedInUserDetails.Id; })) {
            this.cartList = this.allCartItems.filter(function (o) { return o.UserId == _this.loggedInUserDetails.Id; });
            this.calculateTotalCost(this.cartList);
        }
    };
    CartComponent.prototype.quantityChanged = function (item, event) {
        var _this = this;
        var val = event.target.value;
        if (Number.isNaN(val) || val <= 0)
            event.target.value = 1;
        for (var i = 0; i < this.allCartItems.length; i++) {
            if ((this.allCartItems[i].ProductID == item.ProductID) && (this.allCartItems[i].UserId == item.UserId)) {
                this.allCartItems[i].Quantity = parseInt(event.target.value);
                //break;
            }
        }
        this.cartList = this.allCartItems.filter(function (o) { return o.UserId == _this.loggedInUserDetails.Id; });
        this.calculateTotalCost(this.cartList);
        localStorage.setItem('cartItems', JSON.stringify(this.allCartItems));
    };
    CartComponent.prototype.removeFromCart = function (item) {
        var _this = this;
        debugger;
        var itemIndex = this.allCartItems.indexOf(item);
        this.allCartItems.splice(itemIndex, 1);
        this.cartList = this.allCartItems.filter(function (o) { return o.UserId == _this.loggedInUserDetails.Id; });
        this.calculateTotalCost(this.cartList);
        localStorage.setItem('cartItems', JSON.stringify(this.allCartItems));
    };
    CartComponent.prototype.continueShopping = function () {
        this.router.navigate(['/product']);
    };
    CartComponent.prototype.calculateTotalCost = function (cartList) {
        this.subTotalPrice = 0;
        for (var i = 0; i < cartList.length; i++) {
            this.subTotalPrice += cartList[i].Quantity * cartList[i].Price;
        }
    };
    CartComponent.prototype.ConvertToPO = function () {
        var iye = localStorage.getItem('cartItems');
    };
    CartComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/Components/Cart/cart.component.html'
        }),
        __metadata("design:paramtypes", [user_service_1.UserService, auth_guard_1.AuthGuard, router_1.Router])
    ], CartComponent);
    return CartComponent;
}());
exports.CartComponent = CartComponent;
//# sourceMappingURL=cart.component.js.map