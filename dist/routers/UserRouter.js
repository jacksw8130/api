"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const UserValidators_1 = require("./validators/UserValidators");
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/login', UserValidators_1.UserValidators.login(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, UserController_1.UserController.login);
        this.router.get('/data', GlobalMiddleWare_1.GlobalMiddleWare.authenticate, UserController_1.UserController.userData);
        this.router.get('/transaction', GlobalMiddleWare_1.GlobalMiddleWare.authenticate, UserController_1.UserController.transaction);
        this.router.get('/all_bid', GlobalMiddleWare_1.GlobalMiddleWare.authenticate, UserController_1.UserController.allBid);
    }
    postRoutes() {
        // session
        //this.router.post('/password/forgot', UserValidators.passwordForgot(), GlobalMiddleWare.checkError, UserController.passwordForgot);
        this.router.post('/password/change', GlobalMiddleWare_1.GlobalMiddleWare.authenticate, UserValidators_1.UserValidators.passwordChange(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, UserController_1.UserController.passwordChange);
        this.router.post('/bid', GlobalMiddleWare_1.GlobalMiddleWare.authenticate, UserValidators_1.UserValidators.bid(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, UserController_1.UserController.bid);
        this.router.post('/bid_candidate', GlobalMiddleWare_1.GlobalMiddleWare.authenticate, UserValidators_1.UserValidators.bid_candidate(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, UserController_1.UserController.bid_candidate);
    }
    patchRoutes() {
        this.router.patch('/update', GlobalMiddleWare_1.GlobalMiddleWare.authenticate, UserController_1.UserController.profile);
        //this.router.patch('/update/:id', GlobalMiddleWare.ownerAuthenticate, UserValidators.update(), GlobalMiddleWare.checkError, UserController.update);
    }
    deleteRoutes() {
        //this.router.delete('/delete/:id', GlobalMiddleWare.authenticate, UserValidators.deleteUser(), GlobalMiddleWare.checkError, UserController.deleteUser);
    }
}
exports.default = new UserRouter().router;
