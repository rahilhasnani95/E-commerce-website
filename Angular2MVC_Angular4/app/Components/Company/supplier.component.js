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
var supplier_service_1 = require("../../Service/Supplier/supplier.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../../Shared/enum");
var global_1 = require("../../Shared/global");
var SupplierComponent = (function () {
    function SupplierComponent(fb, _supplierService) {
        this.fb = fb;
        this._supplierService = _supplierService;
        this.indLoading = false;
    }
    SupplierComponent.prototype.ngOnInit = function () {
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
        });
        this.LoadSuppliers();
    };
    SupplierComponent.prototype.LoadSuppliers = function () {
        var _this = this;
        this.indLoading = true;
        this._supplierService.get(global_1.Global.BASE_SUPPLIER_ENDPOINT)
            .subscribe(function (suppliers) { _this.suppliers = suppliers; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    SupplierComponent.prototype.addSupplier = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Supplier";
        this.modalBtnTitle = "Add";
        this.supplierFrm.reset();
        this.modal.open();
    };
    SupplierComponent.prototype.editSupplier = function (id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Supplier";
        this.modalBtnTitle = "Update";
        this.supplier = this.suppliers.filter(function (x) { return x.Id == id; })[0];
        this.supplierFrm.setValue(this.supplier);
        this.modal.open();
    };
    SupplierComponent.prototype.deleteSupplier = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.supplier = this.suppliers.filter(function (x) { return x.Id == id; })[0];
        this.supplierFrm.setValue(this.supplier);
        this.modal.open();
    };
    SupplierComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        switch (this.dbops) {
            case enum_1.DBOperation.create:
                this._supplierService.post(global_1.Global.BASE_SUPPLIER_ENDPOINT, formData._value).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully added.";
                        _this.LoadSuppliers();
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
                this._supplierService.put(global_1.Global.BASE_SUPPLIER_ENDPOINT, formData._value.Id, formData._value).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully updated.";
                        _this.LoadSuppliers();
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
                this._supplierService.delete(global_1.Global.BASE_SUPPLIER_ENDPOINT, formData._value.Id).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully deleted.";
                        _this.LoadSuppliers();
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
    SupplierComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.supplierFrm.enable() : this.supplierFrm.disable();
    };
    return SupplierComponent;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], SupplierComponent.prototype, "modal", void 0);
SupplierComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/Components/Supplier/supplier.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, supplier_service_1.SupplierService])
], SupplierComponent);
exports.SupplierComponent = SupplierComponent;
//# sourceMappingURL=supplier.component.js.map