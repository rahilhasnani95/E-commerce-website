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
var company_service_1 = require("../../Service/Company/company.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../../Shared/enum");
var global_1 = require("../../Shared/global");
var auth_guard_1 = require("../../Components/Login/Guard/auth.guard");
var UserComponent = /** @class */ (function () {
    function UserComponent(fb, _userService, _companyService, authGuard) {
        this.fb = fb;
        this._userService = _userService;
        this._companyService = _companyService;
        this.authGuard = authGuard;
        this.indLoading = false;
    }
    UserComponent.prototype.ngOnInit = function () {
        this.userFrm = this.fb.group({
            Id: [''],
            FirstName: ['', forms_1.Validators.required],
            LastName: [''],
            Gender: ['', forms_1.Validators.required],
            Role: ['', forms_1.Validators.required],
            UserName: ['', forms_1.Validators.required],
            Password: ['', forms_1.Validators.required],
            CompanyId: ['', forms_1.Validators.required],
            SecurityAnswer: ['', forms_1.Validators.required],
        });
        this.loggedInUserDetails = this.authGuard.getUserAndUrlDetail();
        this.LoadUsers();
    };
    UserComponent.prototype.LoadUsers = function () {
        var _this = this;
        this.indLoading = true;
        this._userService.get(global_1.Global.BASE_USER_ENDPOINT)
            .subscribe(function (users) {
            _this.users = users;
            if (_this.loggedInUserDetails.UserRole != enum_1.Roles.SuperAdmin)
                _this.users = _this.users.filter(function (x) { return x.CompanyId == _this.loggedInUserDetails.CompanyId; });
            _this.indLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    UserComponent.prototype.LoadAllCompanies = function () {
        var _this = this;
        this._companyService.get(global_1.Global.BASE_COMPANY_ENDPOINT)
            .subscribe(function (companies) { _this.companies = companies; }, function (error) { return _this.msg = error; });
    };
    UserComponent.prototype.editUser = function (id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit User";
        this.modalBtnTitle = "Update";
        this.securityQuestion = global_1.Global.SECURITY_QUESTION;
        this.LoadAllCompanies();
        this.LoadUsers();
        this.user = this.users.filter(function (x) { return x.Id == id; })[0];
        this.userFrm.patchValue(this.user);
        this.modal.open();
    };
    UserComponent.prototype.deleteUser = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.user = this.users.filter(function (x) { return x.Id == id; })[0];
        this.userFrm.patchValue(this.user);
        this.modal.open();
    };
    UserComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        switch (this.dbops) {
            case enum_1.DBOperation.update:
                this._userService.put(global_1.Global.BASE_USER_ENDPOINT, formData._value.Id, formData._value).subscribe(function (data) {
                    if (data == 1) //Success
                     {
                        _this.msg = "Updated Successfully";
                        if (_this.loggedInUserDetails.Id == formData._value.Id)
                            _this.deleteLocalCurrentUserAndReload();
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
                this._userService.delete(global_1.Global.BASE_USER_ENDPOINT, formData._value.Id).subscribe(function (data) {
                    if (data == 1) //Success
                     {
                        if (_this.loggedInUserDetails.Id == formData._value.Id)
                            _this.deleteLocalCurrentUserAndReload();
                        _this.msg = "Data successfully deleted.";
                        _this.LoadUsers();
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
    //Delete if logged in user has bee update
    UserComponent.prototype.deleteLocalCurrentUserAndReload = function () {
        localStorage.removeItem('currentUser');
        window.location.reload();
    };
    UserComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    };
    UserComponent.prototype.criteriaChange = function (value) {
        if (value != '[object Event]')
            this.listFilter = value;
    };
    __decorate([
        core_1.ViewChild('modal'),
        __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
    ], UserComponent.prototype, "modal", void 0);
    UserComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/Components/User/user.component.html'
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, user_service_1.UserService, company_service_1.CompanyService, auth_guard_1.AuthGuard])
    ], UserComponent);
    return UserComponent;
}());
exports.UserComponent = UserComponent;
//# sourceMappingURL=user.component.js.map