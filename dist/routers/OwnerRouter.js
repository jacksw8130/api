"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OwnerController_1 = require("../controllers/OwnerController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const OwnerValidators_1 = require("./validators/OwnerValidators");
class OwnerRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/data', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, OwnerController_1.OwnerController.data);
        this.router.get('/all', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, OwnerController_1.OwnerController.all);
        this.router.get('/super_admin/all', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, OwnerController_1.OwnerController.allSuperadmin);
        this.router.get('/super_admin/admin/:id', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, OwnerValidators_1.OwnerValidators.allOwner(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, OwnerController_1.OwnerController.allOwner);
        this.router.get('/super_admin/admin/user/:id', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, OwnerValidators_1.OwnerValidators.allUser(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, OwnerController_1.OwnerController.allUser);
        this.router.get('/login', OwnerValidators_1.OwnerValidators.login(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, OwnerController_1.OwnerController.login);
        this.router.get('/transaction/all', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, OwnerController_1.OwnerController.allTransaction);
        this.router.get('/transaction/my', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, OwnerController_1.OwnerController.myTransaction);
    }
    postRoutes() {
        this.router.post('/signup', OwnerValidators_1.OwnerValidators.signup(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, OwnerController_1.OwnerController.signup);
        this.router.post('/super_admin/create', OwnerValidators_1.OwnerValidators.createSuperadmin(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, OwnerController_1.OwnerController.createSuperadmin);
        this.router.post('/transfer/super_admin', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, OwnerValidators_1.OwnerValidators.transfer(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, OwnerController_1.OwnerController.transfer);
        this.router.post('/withdraw/super_admin', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, OwnerValidators_1.OwnerValidators.withdraw(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, OwnerController_1.OwnerController.withdraw);
    }
    patchRoutes() {
        this.router.patch('/update', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, OwnerController_1.OwnerController.update);
        this.router.patch('/super_admin/update/:id', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, OwnerValidators_1.OwnerValidators.updateSuperadmin(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, OwnerController_1.OwnerController.updateSuperadmin);
    }
    deleteRoutes() {
    }
}
exports.default = new OwnerRouter().router;
