import { Router } from "express";
import { TicketCandidateController } from "../controllers/TicketCandidateController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Utils } from "../utils/Utils";
import { TicketCandidateValidators } from "./validators/TicketCandidateValidators";

class TicketCandidateRouter {
    public router: Router;
    constructor(){
        this.router=Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();

    }
 
    getRoutes(){
        this.router.get('/id/:id', TicketCandidateValidators.TicketCandidate(), GlobalMiddleWare.checkError, TicketCandidateController.ticketCandidate);
        this.router.get('/bid/:id', GlobalMiddleWare.superadminAuthenticate, TicketCandidateValidators.TicketCandidate(), GlobalMiddleWare.checkError, TicketCandidateController.ticketCandidateBids);
        this.router.get('/candidate/:id', TicketCandidateValidators.stateTicketCandidate(), GlobalMiddleWare.checkError, TicketCandidateController.ticketCandidate);
        this.router.get('/state/:id', TicketCandidateValidators.stateTicket(), GlobalMiddleWare.checkError, TicketCandidateController.stateTicket);
        this.router.get('/location/:id', TicketCandidateValidators.locationTicket(), GlobalMiddleWare.checkError, TicketCandidateController.locationTicket);
        this.router.get('/all', TicketCandidateController.allTicketCandidate);
        this.router.get('/super_admin/all', GlobalMiddleWare.superadminAuthenticate, TicketCandidateController.allOwnerTicketCandidate);
    }
    postRoutes(){
        this.router.post('/create', GlobalMiddleWare.superadminAuthenticate, TicketCandidateValidators.create(), GlobalMiddleWare.checkError, TicketCandidateController.create);
    }
    patchRoutes(){
        this.router.patch('/update/:id', GlobalMiddleWare.superadminAuthenticate, TicketCandidateValidators.update(), GlobalMiddleWare.checkError, TicketCandidateController.update);
        this.router.patch('/result/:id', GlobalMiddleWare.superadminAuthenticate, TicketCandidateValidators.update(), GlobalMiddleWare.checkError, TicketCandidateController.update);
    }
    deleteRoutes(){
        this.router.delete('/delete/:id', GlobalMiddleWare.superadminAuthenticate, TicketCandidateValidators.delete(), GlobalMiddleWare.checkError,TicketCandidateController.delete)
    }
}

export default new TicketCandidateRouter().router;