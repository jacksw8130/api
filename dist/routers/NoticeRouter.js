"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NoticeController_1 = require("../controllers/NoticeController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const NoticeValidators_1 = require("./validators/NoticeValidators");
class NoticeRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/id/:id', NoticeValidators_1.NoticeValidators.Notice(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, NoticeController_1.NoticeController.Notice);
        this.router.get('/all', NoticeController_1.NoticeController.allNotice);
        this.router.get('/super_admin/all', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, NoticeController_1.NoticeController.allSuperAdminNotice);
    }
    postRoutes() {
        this.router.post('/create', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, NoticeValidators_1.NoticeValidators.create(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, NoticeController_1.NoticeController.create);
    }
    patchRoutes() {
        this.router.patch('/update/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, NoticeValidators_1.NoticeValidators.update(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, NoticeController_1.NoticeController.update);
    }
    deleteRoutes() {
        this.router.delete('/delete/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, NoticeValidators_1.NoticeValidators.delete(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, NoticeController_1.NoticeController.delete);
    }
}
exports.default = new NoticeRouter().router;
