"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CandidateController_1 = require("../controllers/CandidateController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const CandidateValidators_1 = require("./validators/CandidateValidators");
class CandidateRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/id/:id', CandidateValidators_1.CandidateValidators.Candidate(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, CandidateController_1.CandidateController.Candidate);
        this.router.get('/all', CandidateController_1.CandidateController.allCandidate);
        this.router.get('/super_admin/all', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, CandidateController_1.CandidateController.allOwnerCandidate);
        this.router.get('/state/:id', CandidateValidators_1.CandidateValidators.stateCandidate(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, CandidateController_1.CandidateController.stateCandidate);
        this.router.get('/location/:id', CandidateValidators_1.CandidateValidators.locationCandidate(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, CandidateController_1.CandidateController.locationCandidate);
    }
    postRoutes() {
        this.router.post('/create', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, CandidateValidators_1.CandidateValidators.create(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, CandidateController_1.CandidateController.create);
    }
    patchRoutes() {
        this.router.patch('/update/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, CandidateValidators_1.CandidateValidators.update(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, CandidateController_1.CandidateController.update);
        this.router.patch('/result/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, CandidateValidators_1.CandidateValidators.result(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, CandidateController_1.CandidateController.result);
    }
    deleteRoutes() {
        this.router.delete('/delete/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, CandidateValidators_1.CandidateValidators.delete(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, CandidateController_1.CandidateController.delete);
    }
}
exports.default = new CandidateRouter().router;
