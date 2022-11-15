"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SuperadminController_1 = require("../controllers/SuperadminController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const SuperadminValidators_1 = require("./validators/SuperadminValidators");
class SuperadminRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/data', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminController_1.SuperadminController.data);
        this.router.get('/admin/all', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminController_1.SuperadminController.allAdmin);
        this.router.get('/admin/user/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminValidators_1.SuperadminValidators.allUser(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, SuperadminController_1.SuperadminController.allUser);
        this.router.get('/login', SuperadminValidators_1.SuperadminValidators.login(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, SuperadminController_1.SuperadminController.login);
        this.router.post('/transaction/all', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminController_1.SuperadminController.allTransaction);
        this.router.get('/transaction/my', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminController_1.SuperadminController.myTransaction);
        //this.router.get('/ticket/bid_result/:id', GlobalMiddleWare.superadminAuthenticate, SuperadminValidators.bidResult(), GlobalMiddleWare.checkError, SuperadminController.bidResult);
        this.router.get('/user/all', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminController_1.SuperadminController.sAllUser);
        this.router.get('/user/transaction/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminValidators_1.SuperadminValidators.userTransaction(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, SuperadminController_1.SuperadminController.userTransaction);
        this.router.get('/admin/transaction/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminValidators_1.SuperadminValidators.adminTransaction(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, SuperadminController_1.SuperadminController.adminTransaction);
    }
    postRoutes() {
        this.router.post('/signup', SuperadminValidators_1.SuperadminValidators.signup(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, SuperadminController_1.SuperadminController.signup);
        this.router.post('/admin/create', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminValidators_1.SuperadminValidators.createAdmin(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, SuperadminController_1.SuperadminController.createAdmin);
        this.router.post('/check_admin', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminValidators_1.SuperadminValidators.checkAdmin(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, SuperadminController_1.SuperadminController.checkAdmin);
        this.router.post('/transfer/admin', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminValidators_1.SuperadminValidators.transfer(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, SuperadminController_1.SuperadminController.transfer);
        this.router.post('/withdraw/admin', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminValidators_1.SuperadminValidators.withdraw(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, SuperadminController_1.SuperadminController.withdraw);
    }
    patchRoutes() {
        this.router.patch('/update', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminController_1.SuperadminController.update);
        this.router.patch('/admin/update/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminValidators_1.SuperadminValidators.updateAdmin(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, SuperadminController_1.SuperadminController.updateAdmin);
        this.router.patch('/user/update/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, SuperadminValidators_1.SuperadminValidators.updateUser(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, SuperadminController_1.SuperadminController.updateUser);
    }
    deleteRoutes() {
    }
}
exports.default = new SuperadminRouter().router;
