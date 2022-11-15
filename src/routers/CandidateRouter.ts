import { Router } from "express";
import { CandidateController } from "../controllers/CandidateController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Utils } from "../utils/Utils";
import { CandidateValidators } from "./validators/CandidateValidators";

class CandidateRouter {
    public router: Router;
    constructor(){
        this.router=Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();

    }

    getRoutes(){
        this.router.get('/id/:id', CandidateValidators.Candidate(), GlobalMiddleWare.checkError, CandidateController.Candidate);
        this.router.get('/all', CandidateController.allCandidate);
        this.router.get('/super_admin/all', GlobalMiddleWare.superadminAuthenticate, CandidateController.allOwnerCandidate);
        this.router.get('/state/:id', CandidateValidators.stateCandidate(), GlobalMiddleWare.checkError, CandidateController.stateCandidate);
        this.router.get('/location/:id', CandidateValidators.locationCandidate(), GlobalMiddleWare.checkError, CandidateController.locationCandidate);
    }
    postRoutes(){
        this.router.post('/create', GlobalMiddleWare.superadminAuthenticate, CandidateValidators.create(), GlobalMiddleWare.checkError, CandidateController.create);
    }
    patchRoutes(){
        this.router.patch('/update/:id', GlobalMiddleWare.superadminAuthenticate, CandidateValidators.update(), GlobalMiddleWare.checkError, CandidateController.update);
        this.router.patch('/result/:id', GlobalMiddleWare.superadminAuthenticate, CandidateValidators.result(), GlobalMiddleWare.checkError, CandidateController.result);
    }
    deleteRoutes(){
        this.router.delete('/delete/:id', GlobalMiddleWare.superadminAuthenticate, CandidateValidators.delete(), GlobalMiddleWare.checkError,CandidateController.delete)
    }
}

export default new CandidateRouter().router;