import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../Service/User/user.service';
import { CompanyService } from '../../Service/Company/company.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { IUser } from '../../Model/User/user';
import { ICompany } from '../../Model/Company/company';
import { DBOperation, Roles } from '../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../Shared/global';
import { AuthGuard } from '../../Components/Login/Guard/auth.guard';

@Component({
    templateUrl: 'app/Components/User/user.component.html'
})

export class UserComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    users: IUser[];
    user: IUser;
    allRoles: Roles;
    loggedInUserDetails: IUser;
    msg: string;
    indLoading: boolean = false;
    userFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    listFilter: string;
    companies: ICompany[];
    securityQuestion: string;

    constructor(private fb: FormBuilder, private _userService: UserService, private _companyService: CompanyService, private authGuard: AuthGuard) { }

    ngOnInit(): void {

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


        });
        this.loggedInUserDetails = this.authGuard.getUserAndUrlDetail();
        this.LoadUsers();

    }

    LoadUsers(): void {
        this.indLoading = true;
        this._userService.get(Global.BASE_USER_ENDPOINT)
            .subscribe(users => {
                this.users = users;
                if (this.loggedInUserDetails.UserRole != Roles.SuperAdmin)
                    this.users = this.users.filter(x => x.CompanyId == this.loggedInUserDetails.CompanyId);
                this.indLoading = false;
            },
            error => this.msg = <any>error);
    }
    LoadAllCompanies(): void {

        this._companyService.get(Global.BASE_COMPANY_ENDPOINT)
            .subscribe(companies => { this.companies = companies },
            error => this.msg = <any>error);
    }


    editUser(id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit User";
        this.modalBtnTitle = "Update";
        this.securityQuestion = Global.SECURITY_QUESTION;
        this.LoadAllCompanies();
        this.LoadUsers();
        this.user = this.users.filter(x => x.Id == id)[0];
        this.userFrm.patchValue(this.user);
        this.modal.open();
    }

    deleteUser(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.user = this.users.filter(x => x.Id == id)[0];
        this.userFrm.patchValue(this.user);
        this.modal.open();
    }

    onSubmit(formData: any) {
        this.msg = "";

        switch (this.dbops) {

            case DBOperation.update:
                this._userService.put(Global.BASE_USER_ENDPOINT, formData._value.Id, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {

                            this.msg = "Updated Successfully";
                            if (this.loggedInUserDetails.Id == formData._value.Id)
                                this.deleteLocalCurrentUserAndReload();

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

            case DBOperation.delete:
                this._userService.delete(Global.BASE_USER_ENDPOINT, formData._value.Id).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            if (this.loggedInUserDetails.Id == formData._value.Id)
                                this.deleteLocalCurrentUserAndReload();
                            this.msg = "Data successfully deleted.";
                            this.LoadUsers();
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

        }
    }
    //Delete if logged in user has bee update
    deleteLocalCurrentUserAndReload(): void {
        localStorage.removeItem('currentUser');
        window.location.reload();
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    }
    criteriaChange(value: string): void {
        if (value != '[object Event]')
            this.listFilter = value;

    }
}