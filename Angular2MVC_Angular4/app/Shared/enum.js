"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DBOperation;
(function (DBOperation) {
    DBOperation[DBOperation["create"] = 1] = "create";
    DBOperation[DBOperation["update"] = 2] = "update";
    DBOperation[DBOperation["delete"] = 3] = "delete";
})(DBOperation = exports.DBOperation || (exports.DBOperation = {}));
var Roles;
(function (Roles) {
    Roles[Roles["SuperAdmin"] = 1] = "SuperAdmin";
    Roles[Roles["BuyerAdmin"] = 2] = "BuyerAdmin";
    Roles[Roles["BuyerUser"] = 3] = "BuyerUser";
    Roles[Roles["SupplierAdmin"] = 4] = "SupplierAdmin";
    Roles[Roles["SupplierUser"] = 5] = "SupplierUser";
})(Roles = exports.Roles || (exports.Roles = {}));
//# sourceMappingURL=enum.js.map