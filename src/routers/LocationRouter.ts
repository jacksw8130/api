import { Router } from "express";
import { LocationController } from "../controllers/LocationController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Utils } from "../utils/Utils";
import { LocationValidators } from "./validators/LocationValidators";

class LocationRouter {
    public router: Router;
    constructor(){
        this.router=Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();

    }

    getRoutes(){
        this.router.get('/id/:id', LocationValidators.Location(), GlobalMiddleWare.checkError, LocationController.Location);
        this.router.get('/all', LocationController.allLocation);
        this.router.get('/super_admin/all', GlobalMiddleWare.superadminAuthenticate, LocationController.allOwnerLocation);
        this.router.get('/state/:id', LocationValidators.stateLocation(), GlobalMiddleWare.checkError, LocationController.stateLocation);
    }
    postRoutes(){
        this.router.post('/create', GlobalMiddleWare.superadminAuthenticate, LocationValidators.create(), GlobalMiddleWare.checkError, LocationController.create);
    }
    patchRoutes(){
        this.router.patch('/update/:id', GlobalMiddleWare.superadminAuthenticate, LocationValidators.update(), GlobalMiddleWare.checkError, LocationController.update);
        this.router.patch('/result/:id', GlobalMiddleWare.superadminAuthenticate, LocationValidators.result(), GlobalMiddleWare.checkError, LocationController.result);
    }
    deleteRoutes(){
        this.router.delete('/delete/:id', GlobalMiddleWare.superadminAuthenticate, LocationValidators.delete(), GlobalMiddleWare.checkError,LocationController.delete)
    }
}

export default new LocationRouter().router;