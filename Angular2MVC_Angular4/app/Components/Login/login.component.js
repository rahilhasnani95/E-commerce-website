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
var auth_service_1 = require("../../Service/Login/auth.service");
var auth_guard_1 = require("../../Components/Login/Guard/auth.guard");
var app_component_1 = require("../../app.component");
var user_service_1 = require("../../Service/User/user.service");
var company_service_1 = require("../../Service/Company/company.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../../Shared/enum");
var global_1 = require("../../Shared/global");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(userService, companyService, route, router, authenticationService, appComponent, authGuard, fb) {
        this.userService = userService;
        this.companyService = companyService;
        this.route = route;
        this.router = router;
        this.authenticationService = authenticationService;
        this.appComponent = appComponent;
        this.authGuard = authGuard;
        this.fb = fb;
        this.model = {};
        this.loading = false;
        this.passwordAttempt = 0;
        this.msg = this.appComponent.loggedMessage;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.LoadAllUsers();
        //initializing register form
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
            IsLocked: [false]
        });
        this.isLoggedIn = this.appComponent.isLoggedIn;
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    };
    LoginComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.loading = true;
        var thisUser = this.users.filter(function (o) { return o.UserName.toLowerCase() == _this.model.username.toLowerCase(); })[0];
        if (thisUser) {
            if (++this.passwordAttempt > 5 && !thisUser.IsLocked)
                this.updateAccount(thisUser, true);
        }
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(function (data) {
            if (_this.authGuard.IsUserLoggedIn()) {
                _this.appComponent.userDetails = _this.authGuard.getUserAndUrlDetail();
                if (_this.authGuard.getUserAndUrlDetail().IsLocked) {
                    _this.msg = "Your account is locked/disabled.Please reset password to continue";
                    _this.authenticationService.logout();
                    _this.appComponent.isLoggedIn = false;
                    _this.returnUrl = 'login';
                }
                else {
                    _this.msg = '';
                    _this.returnUrl = _this.appComponent.userDetails.URL;
                    _this.appComponent.isLoggedIn = true;
                }
            }
            else if (thisUser && thisUser.IsLocked) {
                _this.msg = "Your account is locked/disabled.Please reset password to continue";
                _this.appComponent.isLoggedIn = false;
                _this.returnUrl = 'login';
            }
            else
                _this.msg = "Invalid Username or Password";
            _this.loading = false;
            _this.router.navigate([_this.returnUrl]);
        }, function (error) {
            //this.alertService.error(error._body);
            _this.loading = false;
        });
    };
    LoginComponent.prototype.LoadAllCompanies = function () {
        var _this = this;
        this.companyService.get(global_1.Global.BASE_COMPANY_ENDPOINT)
            .subscribe(function (companies) { _this.companies = companies; }, function (error) { return _this.msg = error; });
    };
    LoginComponent.prototype.LoadAllUsers = function () {
        var _this = this;
        this.userService.get(global_1.Global.BASE_USER_ENDPOINT)
            .subscribe(function (users) {
            _this.users = users;
        }, function (error) { return _this.msg = error; });
    };
    LoginComponent.prototype.register = function () {
        this.isForgotPassword = false;
        this.passwordString = "Password*";
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Register New User";
        this.modalBtnTitle = "Register";
        this.userFrm.reset();
        this.securityQuestion = global_1.Global.SECURITY_QUESTION;
        this.LoadAllCompanies();
        this.LoadAllUsers();
        this.modal.open();
    };
    LoginComponent.prototype.forgotPassword = function () {
        var _this = this;
        this.model.password = '';
        if (this.model.username == '' || this.model.username == undefined) {
            this.msg = "Please enter a valid User Name to continue reseting your password";
            return;
        }
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.passwordString = "New Password*";
        this.model.password = '';
        this.modalTitle = "Reset Password";
        this.modalBtnTitle = "Reset";
        this.securityQuestion = global_1.Global.SECURITY_QUESTION;
        this.LoadAllUsers();
        this.user = this.users.filter(function (x) { return x.UserName == _this.model.username; })[0];
        if (this.user) {
            this.userSecurityAnswer = this.user.SecurityAnswer;
            this.isForgotPassword = true;
            this.user.SecurityAnswer = '';
            this.user.Password = '';
            this.userFrm.patchValue(this.user);
            this.modal.open();
        }
        else
            this.msg = "This User Name is invalid/Not registerd.Please enter valid User Name to reset password";
    };
    LoginComponent.prototype.updateAccount = function (user, isLocked) {
        var _this = this;
        user.IsLocked = isLocked;
        this.userService.put(global_1.Global.BASE_USER_ENDPOINT, user.Id, user).subscribe(function (data) {
            if (data == 1 && isLocked) //Success
             {
                _this.msg = "Your account is locked/ disabled.Please reset password to continue";
                _this.model.password = '';
            }
            else if (data == 1 && !isLocked) //Success
             {
                _this.passwordAttempt = 0;
                _this.msg = "Password Reset Successfully.Please login to continue";
                _this.model.password = '';
            }
            else {
                _this.msg = "There is some issue in updating records, please contact to system administrator!";
            }
            _this.LoadAllUsers();
            _this.modal.dismiss();
        }, function (error) {
            _this.msg = error;
        });
    };
    LoginComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        switch (this.dbops) {
            case enum_1.DBOperation.create:
                this.userService.post(global_1.Global.BASE_USER_ENDPOINT, formData._value).subscribe(function (data) {
                    if (data == 1) //Success
                     {
                        _this.msg = "User successfully registered.Please Login with your credentials";
                        // this.LoadUsers();
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
                if (formData._value.SecurityAnswer == this.userSecurityAnswer)
                    this.updateAccount(formData._value, false);
                else
                    this.msg = "Security answer is wrong.Password couldn't be reset, please try again!";
                this.modal.dismiss();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modal'),
        __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
    ], LoginComponent.prototype, "modal", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            //moduleId: module.id,
            templateUrl: "app/Components/Login/login.component.html"
        }),
        __metadata("design:paramtypes", [user_service_1.UserService,
            company_service_1.CompanyService,
            router_1.ActivatedRoute,
            router_1.Router,
            auth_service_1.AuthenticationService,
            app_component_1.AppComponent,
            auth_guard_1.AuthGuard,
            forms_1.FormBuilder])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map