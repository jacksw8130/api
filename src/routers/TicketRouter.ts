import { Router } from "express";
import { TicketController } from "../controllers/TicketController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Utils } from "../utils/Utils";
import { TicketValidators } from "./validators/TicketValidators";

class TicketRouter {
    public router: Router;
    constructor(){
        this.router=Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();

    }

    getRoutes(){
        this.router.get('/id/:id', TicketValidators.Ticket(), GlobalMiddleWare.checkError, TicketController.ticket);
        this.router.get('/bid/:id', GlobalMiddleWare.superadminAuthenticate, TicketValidators.Ticket(), GlobalMiddleWare.checkError, TicketController.ticketBids);
        this.router.get('/party/:id', TicketValidators.partyTicket(), GlobalMiddleWare.checkError, TicketController.ticket);
        this.router.get('/all', TicketController.allTicket);
        this.router.get('/super_admin/all', GlobalMiddleWare.superadminAuthenticate, TicketController.allOwnerTicket);
    }
    postRoutes(){
        this.router.post('/create', GlobalMiddleWare.superadminAuthenticate, TicketValidators.create(), GlobalMiddleWare.checkError, TicketController.create);
    }
    patchRoutes(){
        this.router.patch('/update/:id', GlobalMiddleWare.superadminAuthenticate, TicketValidators.update(), GlobalMiddleWare.checkError, TicketController.update);
        this.router.patch('/result/:id', GlobalMiddleWare.superadminAuthenticate, TicketValidators.update(), GlobalMiddleWare.checkError, TicketController.update);
    }
    deleteRoutes(){
        this.router.delete('/delete/:id', GlobalMiddleWare.superadminAuthenticate, TicketValidators.delete(), GlobalMiddleWare.checkError,TicketController.delete)
    }
}

export default new TicketRouter().router;