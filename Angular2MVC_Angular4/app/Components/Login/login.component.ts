import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../Service/Login/auth.service';
import { AuthGuard } from '../../Components/Login/Guard/auth.guard';
import { AppComponent } from '../../app.component';
import { UserService } from '../../Service/User/user.service';
import { CompanyService } from '../../Service/Company/company.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { IUser } from '../../Model/User/user';
import { ICompany } from '../../Model/Company/company';
import { DBOperation } from '../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../Shared/global';

@Component({
    //moduleId: module.id,
    templateUrl: `app/Components/Login/login.component.html`
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    isLoggedIn: boolean;
    @ViewChild('modal') modal: ModalComponent;
    users: IUser[];
    user: IUser;
    passwordAttempt: number = 0;
    passwordString: string;
    msg: string = this.appComponent.loggedMessage;
    userFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    companies: ICompany[];
    securityQuestion: string;
    userSecurityAnswer: string;
    isForgotPassword: boolean;
    constructor(
        private userService: UserService,
        private companyService: CompanyService,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private appComponent: AppComponent,
        private authGuard: AuthGuard,
        private fb: FormBuilder
    ) { }
    
    ngOnInit() {
        this.LoadAllUsers();
        //initializing register form
        this.userFrm = this.fb.group({
            Id: [''],
            FirstName: ['', Validators.required],
            LastName: [''],
            Gender: ['', Validators.required],
            Role: ['', Validators.required],
            UserName: ['', Validators.required],
            Password: ['', Validators.required],
            CompanyId: ['', Validators.required],
            SecurityAnswer: ['', Validators.required],
            IsLocked: [false]

        });
        this.isLoggedIn = this.appComponent.isLoggedIn;
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    }
    login() {
        
        this.loading = true;
        var thisUser = this.users.filter(o => o.UserName.toLowerCase() == this.model.username.toLowerCase())[0];
        if (thisUser) {
            if (++this.passwordAttempt > 5 && !thisUser.IsLocked)
                this.updateAccount(thisUser, true);
        }

        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
            data => {
               
                    if (this.authGuard.IsUserLoggedIn()) {
                        this.appComponent.userDetails = this.authGuard.getUserAndUrlDetail();
                        if (this.authGuard.getUserAndUrlDetail().IsLocked) {
                            this.msg = "Your account is locked/disabled.Please reset password to continue";
                            this.authenticationService.logout();
                            this.appComponent.isLoggedIn = false;
                            this.returnUrl = 'login';
                        }
                        else {
                            this.msg = '';
                            this.returnUrl = this.appComponent.userDetails.URL;
                            this.appComponent.isLoggedIn = true;
                        }

                    }
                    else if (thisUser && thisUser.IsLocked) {
                        this.msg = "Your account is locked/disabled.Please reset password to continue";
                        this.appComponent.isLoggedIn = false;
                        this.returnUrl = 'login';
                    }
                    else
                        this.msg = "Invalid Username or Password";
                
                this.loading = false;
                this.router.navigate([this.returnUrl]);

            },
            error => {
                
                //this.alertService.error(error._body);
                this.loading = false;
            });
    }
    LoadAllCompanies(): void {

        this.companyService.get(Global.BASE_COMPANY_ENDPOINT)
            .subscribe(companies => { this.companies = companies },
            error => this.msg = <any>error);
    }
    LoadAllUsers() {

        this.userService.get(Global.BASE_USER_ENDPOINT)
            .subscribe(users => {
                this.users = users;

            },
            error => this.msg = <any>error);
    }

    register(): void {
        this.isForgotPassword = false;
        this.passwordString = "Password*";
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Register New User";
        this.modalBtnTitle = "Register";
        this.userFrm.reset();
        this.securityQuestion = Global.SECURITY_QUESTION;
        this.LoadAllCompanies();
        this.LoadAllUsers();
        this.modal.open();

    }
    forgotPassword(): void {
        this.model.password = '';
        if (this.model.username == '' || this.model.username == undefined) {
            this.msg = "Please enter a valid User Name to continue reseting your password";
            return;
        }
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.passwordString = "New Password*";
        this.model.password = '';
        this.modalTitle = "Reset Password";
        this.modalBtnTitle = "Reset";
        this.securityQuestion = Global.SECURITY_QUESTION;
        this.LoadAllUsers();
        this.user = this.users.filter(x => x.UserName == this.model.username)[0];
       
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



    }
    updateAccount(user: IUser, isLocked: boolean): void {
        user.IsLocked = isLocked;
        this.userService.put(Global.BASE_USER_ENDPOINT, user.Id, user).subscribe(
            
            data => {
             
                if (data == 1 && isLocked) //Success
                {
                    this.msg = "Your account is locked/ disabled.Please reset password to continue";
                    this.model.password = '';

                }
                else if (data == 1 && !isLocked) //Success
                {
                    this.passwordAttempt = 0;
                    this.msg = "Password Reset Successfully.Please login to continue";
                    this.model.password = '';

                }
                else {
                    this.msg = "There is some issue in updating records, please contact to system administrator!"
                }
                this.LoadAllUsers();
                this.modal.dismiss();
            },
            error => {
                this.msg = error;
            }
        );

    }
    onSubmit(formData: any) {
        this.msg = "";

        switch (this.dbops) {
            case DBOperation.create:
                this.userService.post(Global.BASE_USER_ENDPOINT, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "User successfully registered.Please Login with your credentials";
                            // this.LoadUsers();
                        }
                        else {
                            this.msg = "There is some issue in saving records, please contact to system administrator!"
                        }

                        this.modal.dismiss();
                    },
                    error => {
                        this.msg = error;
                    }
                );
                break;
            case DBOperation.update:
                if (formData._value.SecurityAnswer == this.userSecurityAnswer)
                    this.updateAccount(formData._value, false);
                else
                    this.msg = "Security answer is wrong.Password couldn't be reset, please try again!"

                this.modal.dismiss();
                break;


        }
    }

}