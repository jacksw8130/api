import { Router } from "express";
import { SuperadminController } from "../controllers/SuperadminController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { SuperadminValidators } from "./validators/SuperadminValidators";

class SuperadminRouter {
    public router: Router;
    constructor(){
        this.router=Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
 
    } 

    getRoutes(){
        this.router.get('/data', GlobalMiddleWare.superadminAuthenticate, SuperadminController.data);
        this.router.get('/admin/all', GlobalMiddleWare.superadminAuthenticate, SuperadminController.allAdmin);
        this.router.get('/admin/user/:id', GlobalMiddleWare.superadminAuthenticate, SuperadminValidators.allUser(), GlobalMiddleWare.checkError, SuperadminController.allUser);
        this.router.get('/login', SuperadminValidators.login(), GlobalMiddleWare.checkError, SuperadminController.login);

        this.router.post('/transaction/all', GlobalMiddleWare.superadminAuthenticate, SuperadminController.allTransaction);
        this.router.get('/transaction/my', GlobalMiddleWare.superadminAuthenticate, SuperadminController.myTransaction);
        //this.router.get('/ticket/bid_result/:id', GlobalMiddleWare.superadminAuthenticate, SuperadminValidators.bidResult(), GlobalMiddleWare.checkError, SuperadminController.bidResult);

        this.router.get('/user/all', GlobalMiddleWare.superadminAuthenticate, SuperadminController.sAllUser);
        this.router.get('/user/transaction/:id', GlobalMiddleWare.superadminAuthenticate, SuperadminValidators.userTransaction(), GlobalMiddleWare.checkError, SuperadminController.userTransaction);
        this.router.get('/admin/transaction/:id', GlobalMiddleWare.superadminAuthenticate, SuperadminValidators.adminTransaction(), GlobalMiddleWare.checkError, SuperadminController.adminTransaction);
    }
    postRoutes(){
        this.router.post('/signup', SuperadminValidators.signup(), GlobalMiddleWare.checkError, SuperadminController.signup);
        this.router.post('/admin/create', GlobalMiddleWare.superadminAuthenticate, SuperadminValidators.createAdmin(), GlobalMiddleWare.checkError, SuperadminController.createAdmin);
        this.router.post('/check_admin', GlobalMiddleWare.superadminAuthenticate, SuperadminValidators.checkAdmin(), GlobalMiddleWare.checkError, SuperadminController.checkAdmin);
        this.router.post('/transfer/admin', GlobalMiddleWare.superadminAuthenticate, SuperadminValidators.transfer(), GlobalMiddleWare.checkError, SuperadminController.transfer);
        this.router.post('/withdraw/admin', GlobalMiddleWare.superadminAuthenticate, SuperadminValidators.withdraw(), GlobalMiddleWare.checkError, SuperadminController.withdraw);
    }
    patchRoutes(){
        this.router.patch('/update', GlobalMiddleWare.superadminAuthenticate, SuperadminController.update);
        this.router.patch('/admin/update/:id', GlobalMiddleWare.superadminAuthenticate, SuperadminValidators.updateAdmin(), GlobalMiddleWare.checkError, SuperadminController.updateAdmin);
        this.router.patch('/user/update/:id', GlobalMiddleWare.superadminAuthenticate, SuperadminValidators.updateUser(), GlobalMiddleWare.checkError, SuperadminController.updateUser);
    }
    deleteRoutes(){
    }
}

export default new SuperadminRouter().router;