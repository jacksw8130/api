import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { AdminValidators } from "./validators/AdminValidators";

class AdminRouter {
    public router: Router;
    constructor(){
        this.router=Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
 
    } 

    getRoutes(){
        this.router.get('/data', GlobalMiddleWare.adminAuthenticate, AdminController.data);
        this.router.get('/user/all', GlobalMiddleWare.adminAuthenticate, AdminController.sAllUser);
        this.router.get('/login', AdminValidators.login(), GlobalMiddleWare.checkError, AdminController.login);

        this.router.get('/transaction/all', GlobalMiddleWare.adminAuthenticate, AdminController.allTransaction);
        this.router.get('/user/transaction/:id', GlobalMiddleWare.superadminAuthenticate, AdminValidators.userTransaction(), GlobalMiddleWare.checkError, AdminController.userTransaction);
    }
    postRoutes(){
        this.router.post('/user/create', GlobalMiddleWare.adminAuthenticate, AdminValidators.createUser(), GlobalMiddleWare.checkError, AdminController.createUser);
        this.router.post('/check_user', GlobalMiddleWare.adminAuthenticate, AdminValidators.checkUser(), GlobalMiddleWare.checkError, AdminController.checkUser);
        this.router.post('/transfer/user', GlobalMiddleWare.adminAuthenticate, AdminValidators.transfer(), GlobalMiddleWare.checkError, AdminController.transfer);
        this.router.post('/withdraw/user', GlobalMiddleWare.adminAuthenticate, AdminValidators.withdraw(), GlobalMiddleWare.checkError, AdminController.withdraw);
    }
    patchRoutes(){
        this.router.patch('/update', GlobalMiddleWare.adminAuthenticate, AdminController.update);
        this.router.patch('/user/update/:id', GlobalMiddleWare.adminAuthenticate, AdminValidators.updateUser(), GlobalMiddleWare.checkError, AdminController.updateUser);
    }
    deleteRoutes(){
    }
}

export default new AdminRouter().router;