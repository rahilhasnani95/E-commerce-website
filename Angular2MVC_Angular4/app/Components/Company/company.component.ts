import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../../Service/Company/company.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ICompany } from '../../Model/Company/company';
import { IUser } from '../../Model/User/user';
import { DBOperation, Roles } from '../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../Shared/global';
import { AuthGuard } from '../../Components/Login/Guard/auth.guard';

@Component({
    templateUrl: 'app/Components/Company/company.component.html'
})

export class CompanyComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    companies: ICompany[];
    company: ICompany;
    loggedInUserDetails: IUser;
    msg: string;
    indLoading: boolean = false;
    supplierFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;

    constructor(private fb: FormBuilder, private _companyService: CompanyService, private _authGuard: AuthGuard) { }

    ngOnInit(): void {
        this.supplierFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required],
            Email: [''],
            Phone: [''],
            Owner: ['', Validators.required],
            Street: [''],
            City: ['', Validators.required],
            State: ['', Validators.required],
            Country: ['', Validators.required],
            DUNS: ['', Validators.required],
            CompanyType: ['', Validators.required],
           
        });
        this.loggedInUserDetails = this._authGuard.getUserAndUrlDetail();
        this.LoadCompanies();
    }

    LoadCompanies(): void {
        this.indLoading = true;
        this._companyService.get(Global.BASE_COMPANY_ENDPOINT)
            .subscribe(companies => {
                this.companies = companies;
                if (this.loggedInUserDetails.UserRole != Roles.SuperAdmin)
                    this.companies = this.companies.filter(x => x.Id == this.loggedInUserDetails.CompanyId);
                this.indLoading = false;
            },
            error => this.msg = <any>error);
    }

    addCompany() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Company";
        this.modalBtnTitle = "Add";
        this.supplierFrm.reset();
        this.modal.open();
    }

    editCompany(id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Company";
        this.modalBtnTitle = "Update";
        this.company = this.companies.filter(x => x.Id == id)[0];
        this.supplierFrm.setValue(this.company);
        this.modal.open();
    }

    deleteCompany(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.company = this.companies.filter(x => x.Id == id)[0];
        this.supplierFrm.setValue(this.company);
        this.modal.open();
    }

    onSubmit(formData: any) {
        this.msg = "";

        switch (this.dbops) {
            case DBOperation.create:
                this._companyService.post(Global.BASE_COMPANY_ENDPOINT, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully added.";
                            this.LoadCompanies();
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
                this._companyService.put(Global.BASE_COMPANY_ENDPOINT, formData._value.Id, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully updated.";
                            this.LoadCompanies();
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
                this._companyService.delete(Global.BASE_COMPANY_ENDPOINT, formData._value.Id).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully deleted.";
                            this.LoadCompanies();
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

    SetControlsState(isEnable: boolean) {
        isEnable ? this.supplierFrm.enable() : this.supplierFrm.disable();
    }
}