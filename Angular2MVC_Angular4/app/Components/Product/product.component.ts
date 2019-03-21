import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../Service/Product/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { IProduct } from '../../Model/Product/product';
import { DBOperation, Roles } from '../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../Shared/global';
import { IUser } from '../../Model/User/user';
import { Cart } from '../../Model/Cart/cart';
import { AuthGuard } from '../../Components/Login/Guard/auth.guard';
import { CompanyService } from '../../Service/Company/company.service';
import { ICompany } from '../../Model/Company/company';

@Component({
    templateUrl: 'app/Components/Product/product.component.html'
})

export class ProductComponent implements OnInit {

    @ViewChild('modal') modal: ModalComponent;
    products: IProduct[];

    product: IProduct;
    loggedInUserDetails: IUser;
    msg: string;
    indLoading: boolean = false;
    productFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    listFilter: string;
    cartItems: Cart[] = [];
    cartItem: Cart;
    companies: ICompany[];
    constructor(private fb: FormBuilder, private _productService: ProductService, private companyService: CompanyService, private _authGuard: AuthGuard, private router: Router) { }

    ngOnInit(): void {
        this.LoadProducts();
      
        this.loggedInUserDetails = this._authGuard.getUserAndUrlDetail();
        this.cartItems = JSON.parse(localStorage.getItem('cartItems'));
       
       
        this.productFrm = this.fb.group({
            Id: [''],
            MaterialCode: ['', Validators.required],
            Description: ['', Validators],
            Price: ['', Validators.required],
            Inventory: ['', Validators.required],
            CompanyId: [this.loggedInUserDetails.CompanyId, Validators.required],
            ImagePath: [''],

        });
        this.LoadAllCompanies();
      
    }

    LoadProducts(): void {
        this.indLoading = true;
        this._productService.get(Global.BASE_PRODUCT_ENDPOINT)
            .subscribe(products => {
                this.products = products;
                if (this.loggedInUserDetails.UserRole == Roles.SupplierAdmin || this.loggedInUserDetails.UserRole == Roles.SupplierUser)
                    this.products = this.products.filter(x => x.CompanyId == this.loggedInUserDetails.CompanyId);
            
                this.indLoading = false;
            },
            error => this.msg = <any>error);
    }
    LoadAllCompanies(): void {

        this.companyService.get(Global.BASE_COMPANY_ENDPOINT)
            .subscribe(companies => {
                this.companies = companies;
                this.companies=this.companies.filter(o => o.CompanyType == 'Supplier');
            if (this.loggedInUserDetails.UserRole != Roles.SuperAdmin)
                this.companies = this.companies.filter(x => x.Id == this.loggedInUserDetails.CompanyId);
            },
            error => this.msg = <any>error);
    }
   
    addProduct() {
        this.LoadAllCompanies();
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Product";
        this.modalBtnTitle = "Add";
        this.productFrm.reset();
        this.productFrm.patchValue({ CompanyId: this.loggedInUserDetails.CompanyId});
        this.modal.open();
    }

    editProduct(id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Product";
        this.modalBtnTitle = "Update";
        this.product = this.products.filter(x => x.Id == id)[0];
        this.productFrm.patchValue(this.product);
        this.modal.open();
    }

    deleteProduct(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.product = this.products.filter(x => x.Id == id)[0];
        this.productFrm.setValue(this.product);
        this.modal.open();
    }

    onSubmit(formData: any) {
        this.msg = "";

        switch (this.dbops) {
            case DBOperation.create:
                debugger;
                this._productService.post(Global.BASE_PRODUCT_ENDPOINT, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully added.";
                            this.LoadProducts();
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
                this._productService.put(Global.BASE_PRODUCT_ENDPOINT, formData._value.Id, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully updated.";
                            this.LoadProducts();
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
                this._productService.delete(Global.BASE_PRODUCT_ENDPOINT, formData._value.Id).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully deleted.";
                            this.LoadProducts();
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
        isEnable ? this.productFrm.enable() : this.productFrm.disable();
    }
    criteriaChange(value: string): void {
        if (value != '[object Event]')
            this.listFilter = value;

    }
    addToCart(productObj: IProduct): void {


        if (this.cartItems) {
            if (this.cartItems.filter(d => d.UserId == this.loggedInUserDetails.Id && d.ProductID == productObj.Id)[0]) {
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
    }
    mapProductToCart(product: IProduct): Cart {
        this.cartItem = new Cart();
        this.cartItem.CompanyID = this.loggedInUserDetails.CompanyId;
        this.cartItem.UserId = this.loggedInUserDetails.Id;
        this.cartItem.Description = product.Description;
        this.cartItem.Price = product.Price;
        this.cartItem.ProductID = product.Id;
        this.cartItem.ProductImage = product.ImagePath;
        this.cartItem.Quantity = 1;//have to see
        return this.cartItem;
    }
}