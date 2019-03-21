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
var company_service_1 = require("../../Service/Company/company.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../../Shared/enum");
var global_1 = require("../../Shared/global");
var auth_guard_1 = require("../../Components/Login/Guard/auth.guard");
var CompanyComponent = /** @class */ (function () {
    function CompanyComponent(fb, _companyService, _authGuard) {
        this.fb = fb;
        this._companyService = _companyService;
        this._authGuard = _authGuard;
        this.indLoading = false;
    }
    CompanyComponent.prototype.ngOnInit = function () {
        this.supplierFrm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required],
            Email: [''],
            Phone: [''],
            Owner: ['', forms_1.Validators.required],
            Street: [''],
            City: ['', forms_1.Validators.required],
            State: ['', forms_1.Validators.required],
            Country: ['', forms_1.Validators.required],
            DUNS: ['', forms_1.Validators.required],
            CompanyType: ['', forms_1.Validators.required],
        });
        this.loggedInUserDetails = this._authGuard.getUserAndUrlDetail();
        this.LoadCompanies();
    };
    CompanyComponent.prototype.LoadCompanies = function () {
        var _this = this;
        this.indLoading = true;
        this._companyService.get(global_1.Global.BASE_COMPANY_ENDPOINT)
            .subscribe(function (companies) {
            _this.companies = companies;
            if (_this.loggedInUserDetails.UserRole != enum_1.Roles.SuperAdmin)
                _this.companies = _this.companies.filter(function (x) { return x.Id == _this.loggedInUserDetails.CompanyId; });
            _this.indLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    CompanyComponent.prototype.addCompany = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Company";
        this.modalBtnTitle = "Add";
        this.supplierFrm.reset();
        this.modal.open();
    };
    CompanyComponent.prototype.editCompany = function (id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Company";
        this.modalBtnTitle = "Update";
        this.company = this.companies.filter(function (x) { return x.Id == id; })[0];
        this.supplierFrm.setValue(this.company);
        this.modal.open();
    };
    CompanyComponent.prototype.deleteCompany = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.company = this.companies.filter(function (x) { return x.Id == id; })[0];
        this.supplierFrm.setValue(this.company);
        this.modal.open();
    };
    CompanyComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        switch (this.dbops) {
            case enum_1.DBOperation.create:
                this._companyService.post(global_1.Global.BASE_COMPANY_ENDPOINT, formData._value).subscribe(function (data) {
                    if (data == 1) //Success
                     {
                        _this.msg = "Data successfully added.";
                        _this.LoadCompanies();
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
                this._companyService.put(global_1.Global.BASE_COMPANY_ENDPOINT, formData._value.Id, formData._value).subscribe(function (data) {
                    if (data == 1) //Success
                     {
                        _this.msg = "Data successfully updated.";
                        _this.LoadCompanies();
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
                this._companyService.delete(global_1.Global.BASE_COMPANY_ENDPOINT, formData._value.Id).subscribe(function (data) {
                    if (data == 1) //Success
                     {
                        _this.msg = "Data successfully deleted.";
                        _this.LoadCompanies();
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
    CompanyComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.supplierFrm.enable() : this.supplierFrm.disable();
    };
    __decorate([
        core_1.ViewChild('modal'),
        __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
    ], CompanyComponent.prototype, "modal", void 0);
    CompanyComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/Components/Company/company.component.html'
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, company_service_1.CompanyService, auth_guard_1.AuthGuard])
    ], CompanyComponent);
    return CompanyComponent;
}());
exports.CompanyComponent = CompanyComponent;
//# sourceMappingURL=company.component.js.map