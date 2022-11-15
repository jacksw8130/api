"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PartyController_1 = require("../controllers/PartyController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const PartyValidators_1 = require("./validators/PartyValidators");
class PartyRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/id/:id', PartyValidators_1.PartyValidators.Party(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, PartyController_1.PartyController.Party);
        this.router.get('/all', PartyController_1.PartyController.allParty);
        this.router.get('/owner/all', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, PartyController_1.PartyController.allOwnerParty);
    }
    postRoutes() {
        this.router.post('/create', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, PartyValidators_1.PartyValidators.create(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, PartyController_1.PartyController.create);
    }
    patchRoutes() {
        this.router.patch('/update/:id', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, PartyValidators_1.PartyValidators.update(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, PartyController_1.PartyController.update);
    }
    deleteRoutes() {
        this.router.delete('/delete/:id', GlobalMiddleWare_1.GlobalMiddleWare.ownerAuthenticate, PartyValidators_1.PartyValidators.delete(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, PartyController_1.PartyController.delete);
    }
}
exports.default = new PartyRouter().router;
