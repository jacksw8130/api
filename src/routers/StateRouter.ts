import { Router } from "express";
import { StateController } from "../controllers/StateController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Utils } from "../utils/Utils";
import { StateValidators } from "./validators/StateValidators";

class StateRouter {
    public router: Router;
    constructor(){
        this.router=Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();

    }

    getRoutes(){
        this.router.get('/id/:id', StateValidators.State(), GlobalMiddleWare.checkError, StateController.State);
        this.router.get('/all', StateController.allState);
        this.router.get('/allStateWithTicket', GlobalMiddleWare.authenticate, GlobalMiddleWare.checkError, StateController.allStateWithTicket);
        this.router.get('/user/all', StateController.userAllState);
        this.router.get('/tickets/:stateId', StateValidators.stateTickets(), GlobalMiddleWare.checkError, StateController.stateTickets);
        this.router.get('/super_admin/all', GlobalMiddleWare.superadminAuthenticate, StateController.allOwnerState);
    }
    postRoutes(){
        this.router.post('/create', GlobalMiddleWare.superadminAuthenticate, StateValidators.create(), GlobalMiddleWare.checkError, StateController.create);
    }
    patchRoutes(){
        this.router.patch('/update/:id', GlobalMiddleWare.superadminAuthenticate, StateValidators.update(), GlobalMiddleWare.checkError, StateController.update);
    }
    deleteRoutes(){
        this.router.delete('/delete/:id', GlobalMiddleWare.superadminAuthenticate, StateValidators.delete(), GlobalMiddleWare.checkError,StateController.delete)
    }
}

export default new StateRouter().router;