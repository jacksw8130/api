import { Router } from "express";
import { PartyController } from "../controllers/PartyController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Utils } from "../utils/Utils";
import { PartyValidators } from "./validators/PartyValidators";

class PartyRouter {
    public router: Router;
    constructor(){
        this.router=Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();

    }

    getRoutes(){
        this.router.get('/id/:id', PartyValidators.Party(), GlobalMiddleWare.checkError, PartyController.Party);
        this.router.get('/all', PartyController.allParty);
        this.router.get('/super_admin/all', GlobalMiddleWare.superadminAuthenticate, PartyController.allOwnerParty);
        this.router.get('/state/:id', PartyValidators.stateParty(), GlobalMiddleWare.checkError, PartyController.stateParty);
    }
    postRoutes(){
        this.router.post('/create', GlobalMiddleWare.superadminAuthenticate, PartyValidators.create(), GlobalMiddleWare.checkError, PartyController.create);
    }
    patchRoutes(){
        this.router.patch('/update/:id', GlobalMiddleWare.superadminAuthenticate, PartyValidators.update(), GlobalMiddleWare.checkError, PartyController.update);
        this.router.patch('/result/:id', GlobalMiddleWare.superadminAuthenticate, PartyValidators.result(), GlobalMiddleWare.checkError, PartyController.result);
    }
    deleteRoutes(){
        this.router.delete('/delete/:id', GlobalMiddleWare.superadminAuthenticate, PartyValidators.delete(), GlobalMiddleWare.checkError,PartyController.delete)
    }
}

export default new PartyRouter().router;