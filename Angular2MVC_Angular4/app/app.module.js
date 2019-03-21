"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app.component");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var http_1 = require("@angular/http");
var app_routing_1 = require("./app.routing");
var user_service_1 = require("./Service/User/user.service");
var user_component_1 = require("./Components/User/user.component");
var home_component_1 = require("./Components/Home/home.component");
var company_service_1 = require("./Service/Company/company.service");
var company_component_1 = require("./Components/Company/company.component");
var product_service_1 = require("./Service/Product/product.service");
var product_component_1 = require("./Components/Product/product.component");
var user_pipe_1 = require("./Components/filter/user.pipe");
var product_pipe_1 = require("./Components/filter/product.pipe");
var search_component_1 = require("./Components/Search/search.component");
var forms_1 = require("@angular/forms");
var login_component_1 = require("./Components/Login/login.component");
var auth_service_1 = require("./Service/Login/auth.service");
var auth_guard_1 = require("./Components/Login/Guard/auth.guard");
var cart_component_1 = require("./Components/Cart/cart.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, forms_1.ReactiveFormsModule, forms_1.FormsModule, http_1.HttpModule, app_routing_1.routing, ng2_bs3_modal_1.Ng2Bs3ModalModule],
            declarations: [app_component_1.AppComponent, user_component_1.UserComponent, home_component_1.HomeComponent, company_component_1.CompanyComponent, product_component_1.ProductComponent, user_pipe_1.UserFilterPipe, product_pipe_1.ProductFilterPipe, search_component_1.SearchComponent, login_component_1.LoginComponent, cart_component_1.CartComponent],
            providers: [{ provide: common_1.APP_BASE_HREF, useValue: '/' }, user_service_1.UserService, company_service_1.CompanyService, product_service_1.ProductService, auth_guard_1.AuthGuard, auth_service_1.AuthenticationService],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map