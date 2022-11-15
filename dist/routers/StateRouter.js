"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StateController_1 = require("../controllers/StateController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const StateValidators_1 = require("./validators/StateValidators");
class StateRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/id/:id', StateValidators_1.StateValidators.State(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, StateController_1.StateController.State);
        this.router.get('/all', StateController_1.StateController.allState);
        this.router.get('/allStateWithTicket', GlobalMiddleWare_1.GlobalMiddleWare.authenticate, GlobalMiddleWare_1.GlobalMiddleWare.checkError, StateController_1.StateController.allStateWithTicket);
        this.router.get('/user/all', StateController_1.StateController.userAllState);
        this.router.get('/tickets/:stateId', StateValidators_1.StateValidators.stateTickets(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, StateController_1.StateController.stateTickets);
        this.router.get('/super_admin/all', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, StateController_1.StateController.allOwnerState);
    }
    postRoutes() {
        this.router.post('/create', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, StateValidators_1.StateValidators.create(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, StateController_1.StateController.create);
    }
    patchRoutes() {
        this.router.patch('/update/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, StateValidators_1.StateValidators.update(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, StateController_1.StateController.update);
    }
    deleteRoutes() {
        this.router.delete('/delete/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, StateValidators_1.StateValidators.delete(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, StateController_1.StateController.delete);
    }
}
exports.default = new StateRouter().router;
