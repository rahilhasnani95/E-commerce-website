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
var router_1 = require("@angular/router");
var auth_service_1 = require("./Service/Login/auth.service");
var auth_guard_1 = require("./Components/Login/Guard/auth.guard");
var AppComponent = /** @class */ (function () {
    function AppComponent(authenticationService, router, authGuard) {
        this.authenticationService = authenticationService;
        this.router = router;
        this.authGuard = authGuard;
        this.userDetails = {};
        this.isLoggedIn = false;
        this.cartCount = 0;
    }
    AppComponent.prototype.ngOnInit = function () {
        if (this.authGuard.IsUserLoggedIn()) {
            this.userDetails = this.authGuard.getUserAndUrlDetail();
            this.isLoggedIn = true;
            this.loggedMessage = "You are already logged in";
        }
    };
    AppComponent.prototype.logout = function () {
        this.authenticationService.logout();
        this.isLoggedIn = false;
        this.loggedMessage = "You are successfully logged out";
        this.router.navigate(['login']);
        window.location.reload();
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "user-app",
            template: "<div>\n                    <nav [hidden]='!isLoggedIn' class='navbar navbar-inverse'>\n                        <div class='container-fluid'>\n                            <ul class='nav navbar-nav' style=\"font-size:17px;\">\n                                <li><a [routerLink]=\"['user']\">Users</a></li>\n                                <li><a [routerLink]=\"['company']\">Companies</a></li>\n                                <li ><a [routerLink]=\"['product']\">Products</a></li>\n                                <li style=\"margin-left:520px;\"><a><b>Welcome {{ userDetails.FirstName}} !</b></a></li>\n                                <li *ngIf=\"userDetails.UserRole==2 || userDetails.UserRole==3\" style=\"color:white;padding-top:2px;\"><span href=# [routerLink]=\"['cart']\"><img title=\"Go To Cart\" src=\"../../images/Cart.png\" style=\"width:50px;height:50px;\"/><u>Cart</u></span> | <span href=# (click)=\"logout()\"><u title=\"Logout\">Logout</u></span></li>\n                                <li *ngIf=\"userDetails.UserRole!=2 && userDetails.UserRole!=3\" style=\"color:white;padding-top:13px;\"><span href=# (click)=\"logout()\"><u title=\"Logout\">Logout</u></span></li>\n                            </ul>\n                        </div>\n                    </nav>\n                   \n                    <div class='container'>\n                        <router-outlet></router-outlet>\n                   </div>\n                 </div>"
        }),
        __metadata("design:paramtypes", [auth_service_1.AuthenticationService,
            router_1.Router,
            auth_guard_1.AuthGuard])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map