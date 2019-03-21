"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var home_component_1 = require("./Components/Home/home.component");
var user_component_1 = require("./Components/User/user.component");
var company_component_1 = require("./Components/Company/company.component");
var product_component_1 = require("./Components/Product/product.component");
var login_component_1 = require("./Components/Login/login.component");
var cart_component_1 = require("./Components/Cart/cart.component");
var auth_guard_1 = require("./Components/Login/Guard/auth.guard");
var appRoutes = [
    //{ path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '', component: user_component_1.UserComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'home', component: home_component_1.HomeComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'user', component: user_component_1.UserComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'company', component: company_component_1.CompanyComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'product', component: product_component_1.ProductComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'cart', component: cart_component_1.CartComponent, canActivate: [auth_guard_1.AuthGuard] },
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map