"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../controllers/AdminController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const AdminValidators_1 = require("./validators/AdminValidators");
class AdminRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/data', GlobalMiddleWare_1.GlobalMiddleWare.adminAuthenticate, AdminController_1.AdminController.data);
        this.router.get('/user/all', GlobalMiddleWare_1.GlobalMiddleWare.adminAuthenticate, AdminController_1.AdminController.sAllUser);
        this.router.get('/login', AdminValidators_1.AdminValidators.login(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, AdminController_1.AdminController.login);
        this.router.get('/transaction/all', GlobalMiddleWare_1.GlobalMiddleWare.adminAuthenticate, AdminController_1.AdminController.allTransaction);
        this.router.get('/user/transaction/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, AdminValidators_1.AdminValidators.userTransaction(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, AdminController_1.AdminController.userTransaction);
    }
    postRoutes() {
        this.router.post('/user/create', GlobalMiddleWare_1.GlobalMiddleWare.adminAuthenticate, AdminValidators_1.AdminValidators.createUser(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, AdminController_1.AdminController.createUser);
        this.router.post('/check_user', GlobalMiddleWare_1.GlobalMiddleWare.adminAuthenticate, AdminValidators_1.AdminValidators.checkUser(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, AdminController_1.AdminController.checkUser);
        this.router.post('/transfer/user', GlobalMiddleWare_1.GlobalMiddleWare.adminAuthenticate, AdminValidators_1.AdminValidators.transfer(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, AdminController_1.AdminController.transfer);
        this.router.post('/withdraw/user', GlobalMiddleWare_1.GlobalMiddleWare.adminAuthenticate, AdminValidators_1.AdminValidators.withdraw(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, AdminController_1.AdminController.withdraw);
    }
    patchRoutes() {
        this.router.patch('/update', GlobalMiddleWare_1.GlobalMiddleWare.adminAuthenticate, AdminController_1.AdminController.update);
        this.router.patch('/user/update/:id', GlobalMiddleWare_1.GlobalMiddleWare.adminAuthenticate, AdminValidators_1.AdminValidators.updateUser(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, AdminController_1.AdminController.updateUser);
    }
    deleteRoutes() {
    }
}
exports.default = new AdminRouter().router;
