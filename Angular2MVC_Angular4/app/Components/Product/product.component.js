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
var product_service_1 = require("../../Service/Product/product.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../../Shared/enum");
var global_1 = require("../../Shared/global");
var cart_1 = require("../../Model/Cart/cart");
var auth_guard_1 = require("../../Components/Login/Guard/auth.guard");
var company_service_1 = require("../../Service/Company/company.service");
var ProductComponent = /** @class */ (function () {
    function ProductComponent(fb, _productService, companyService, _authGuard, router) {
        this.fb = fb;
        this._productService = _productService;
        this.companyService = companyService;
        this._authGuard = _authGuard;
        this.router = router;
        this.indLoading = false;
        this.cartItems = [];
    }
    ProductComponent.prototype.ngOnInit = function () {
        this.LoadProducts();
        this.loggedInUserDetails = this._authGuard.getUserAndUrlDetail();
        this.cartItems = JSON.parse(localStorage.getItem('cartItems'));
        this.productFrm = this.fb.group({
            Id: [''],
            MaterialCode: ['', forms_1.Validators.required],
            Description: ['', forms_1.Validators],
            Price: ['', forms_1.Validators.required],
            Inventory: ['', forms_1.Validators.required],
            CompanyId: [this.loggedInUserDetails.CompanyId, forms_1.Validators.required],
            ImagePath: [''],
        });
        this.LoadAllCompanies();
    };
    ProductComponent.prototype.LoadProducts = function () {
        var _this = this;
        this.indLoading = true;
        this._productService.get(global_1.Global.BASE_PRODUCT_ENDPOINT)
            .subscribe(function (products) {
            _this.products = products;
            if (_this.loggedInUserDetails.UserRole == enum_1.Roles.SupplierAdmin || _this.loggedInUserDetails.UserRole == enum_1.Roles.SupplierUser)
                _this.products = _this.products.filter(function (x) { return x.CompanyId == _this.loggedInUserDetails.CompanyId; });
            _this.indLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    ProductComponent.prototype.LoadAllCompanies = function () {
        var _this = this;
        this.companyService.get(global_1.Global.BASE_COMPANY_ENDPOINT)
            .subscribe(function (companies) {
            _this.companies = companies;
            _this.companies = _this.companies.filter(function (o) { return o.CompanyType == 'Supplier'; });
            if (_this.loggedInUserDetails.UserRole != enum_1.Roles.SuperAdmin)
                _this.companies = _this.companies.filter(function (x) { return x.Id == _this.loggedInUserDetails.CompanyId; });
        }, function (error) { return _this.msg = error; });
    };
    ProductComponent.prototype.addProduct = function () {
        this.LoadAllCompanies();
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Product";
        this.modalBtnTitle = "Add";
        this.productFrm.reset();
        this.productFrm.patchValue({ CompanyId: this.loggedInUserDetails.CompanyId });
        this.modal.open();
    };
    ProductComponent.prototype.editProduct = function (id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Product";
        this.modalBtnTitle = "Update";
        this.product = this.products.filter(function (x) { return x.Id == id; })[0];
        this.productFrm.patchValue(this.product);
        this.modal.open();
    };
    ProductComponent.prototype.deleteProduct = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.product = this.products.filter(function (x) { return x.Id == id; })[0];
        this.productFrm.setValue(this.product);
        this.modal.open();
    };
    ProductComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        switch (this.dbops) {
            case enum_1.DBOperation.create:
                debugger;
                this._productService.post(global_1.Global.BASE_PRODUCT_ENDPOINT, formData._value).subscribe(function (data) {
                    if (data == 1) //Success
                     {
                        _this.msg = "Data successfully added.";
                        _this.LoadProducts();
                    }
                    else {
                        _this.msg = "There is some issue in saving records, please contact to system administrator!";
                    }
                    _this.modal.dismiss();
                }, function (error) {
                    _this.msg = error;
                });
                break;
            case enum_1.DBOperation.update:
                this._productService.put(global_1.Global.BASE_PRODUCT_ENDPOINT, formData._value.Id, formData._value).subscribe(function (data) {
                    if (data == 1) //Success
                     {
                        _this.msg = "Data successfully updated.";
                        _this.LoadProducts();
                    }
                    else {
                        _this.msg = "There is some issue in saving records, please contact to system administrator!";
                    }
                    _this.modal.dismiss();
                }, function (error) {
                    _this.msg = error;
                });
                break;
            case enum_1.DBOperation.delete:
                this._productService.delete(global_1.Global.BASE_PRODUCT_ENDPOINT, formData._value.Id).subscribe(function (data) {
                    if (data == 1) //Success
                     {
                        _this.msg = "Data successfully deleted.";
                        _this.LoadProducts();
                    }
                    else {
                        _this.msg = "There is some issue in saving records, please contact to system administrator!";
                    }
                    _this.modal.dismiss();
                }, function (error) {
                    _this.msg = error;
                });
                break;
        }
    };
    ProductComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.productFrm.enable() : this.productFrm.disable();
    };
    ProductComponent.prototype.criteriaChange = function (value) {
        if (value != '[object Event]')
            this.listFilter = value;
    };
    ProductComponent.prototype.addToCart = function (productObj) {
        var _this = this;
        if (this.cartItems) {
            if (this.cartItems.filter(function (d) { return d.UserId == _this.loggedInUserDetails.Id && d.ProductID == productObj.Id; })[0]) {
                for (var i = 0; i < this.cartItems.length; i++) {
                    if ((this.cartItems[i].ProductID == productObj.Id) && (this.cartItems[i].UserId == this.loggedInUserDetails.Id)) {
                        this.cartItems[i].Quantity += 1;
                        break;
                    }
                }
            }
            else
                this.cartItems.push(this.mapProductToCart(productObj));
        }
        else {
            this.cartItems = new Array();
            this.cartItems.push(this.mapProductToCart(productObj));
        }
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        // this.appComponent.cartCount = this.cartItems.filter(d => d.UserId == this.loggedInUserDetails.Id).length;
        this.router.navigate(['/cart']);
    };
    ProductComponent.prototype.mapProductToCart = function (product) {
        this.cartItem = new cart_1.Cart();
        this.cartItem.CompanyID = this.loggedInUserDetails.CompanyId;
        this.cartItem.UserId = this.loggedInUserDetails.Id;
        this.cartItem.Description = product.Description;
        this.cartItem.Price = product.Price;
        this.cartItem.ProductID = product.Id;
        this.cartItem.ProductImage = product.ImagePath;
        this.cartItem.Quantity = 1; //have to see
        return this.cartItem;
    };
    __decorate([
        core_1.ViewChild('modal'),
        __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
    ], ProductComponent.prototype, "modal", void 0);
    ProductComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/Components/Product/product.component.html'
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, product_service_1.ProductService, company_service_1.CompanyService, auth_guard_1.AuthGuard, router_1.Router])
    ], ProductComponent);
    return ProductComponent;
}());
exports.ProductComponent = ProductComponent;
//# sourceMappingURL=product.component.js.map