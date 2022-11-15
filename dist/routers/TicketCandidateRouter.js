"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TicketCandidateController_1 = require("../controllers/TicketCandidateController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const TicketCandidateValidators_1 = require("./validators/TicketCandidateValidators");
class TicketCandidateRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/id/:id', TicketCandidateValidators_1.TicketCandidateValidators.TicketCandidate(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, TicketCandidateController_1.TicketCandidateController.ticketCandidate);
        this.router.get('/bid/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, TicketCandidateValidators_1.TicketCandidateValidators.TicketCandidate(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, TicketCandidateController_1.TicketCandidateController.ticketCandidateBids);
        this.router.get('/candidate/:id', TicketCandidateValidators_1.TicketCandidateValidators.stateTicketCandidate(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, TicketCandidateController_1.TicketCandidateController.ticketCandidate);
        this.router.get('/state/:id', TicketCandidateValidators_1.TicketCandidateValidators.stateTicket(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, TicketCandidateController_1.TicketCandidateController.stateTicket);
        this.router.get('/location/:id', TicketCandidateValidators_1.TicketCandidateValidators.locationTicket(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, TicketCandidateController_1.TicketCandidateController.locationTicket);
        this.router.get('/all', TicketCandidateController_1.TicketCandidateController.allTicketCandidate);
        this.router.get('/super_admin/all', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, TicketCandidateController_1.TicketCandidateController.allOwnerTicketCandidate);
    }
    postRoutes() {
        this.router.post('/create', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, TicketCandidateValidators_1.TicketCandidateValidators.create(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, TicketCandidateController_1.TicketCandidateController.create);
    }
    patchRoutes() {
        this.router.patch('/update/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, TicketCandidateValidators_1.TicketCandidateValidators.update(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, TicketCandidateController_1.TicketCandidateController.update);
        this.router.patch('/result/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, TicketCandidateValidators_1.TicketCandidateValidators.update(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, TicketCandidateController_1.TicketCandidateController.update);
    }
    deleteRoutes() {
        this.router.delete('/delete/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, TicketCandidateValidators_1.TicketCandidateValidators.delete(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, TicketCandidateController_1.TicketCandidateController.delete);
    }
}
exports.default = new TicketCandidateRouter().router;
