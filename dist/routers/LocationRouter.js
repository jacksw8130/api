"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LocationController_1 = require("../controllers/LocationController");
const GlobalMiddleWare_1 = require("../middlewares/GlobalMiddleWare");
const LocationValidators_1 = require("./validators/LocationValidators");
class LocationRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get('/id/:id', LocationValidators_1.LocationValidators.Location(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, LocationController_1.LocationController.Location);
        this.router.get('/all', LocationController_1.LocationController.allLocation);
        this.router.get('/super_admin/all', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, LocationController_1.LocationController.allOwnerLocation);
        this.router.get('/state/:id', LocationValidators_1.LocationValidators.stateLocation(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, LocationController_1.LocationController.stateLocation);
    }
    postRoutes() {
        this.router.post('/create', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, LocationValidators_1.LocationValidators.create(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, LocationController_1.LocationController.create);
    }
    patchRoutes() {
        this.router.patch('/update/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, LocationValidators_1.LocationValidators.update(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, LocationController_1.LocationController.update);
        this.router.patch('/result/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, LocationValidators_1.LocationValidators.result(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, LocationController_1.LocationController.result);
    }
    deleteRoutes() {
        this.router.delete('/delete/:id', GlobalMiddleWare_1.GlobalMiddleWare.superadminAuthenticate, LocationValidators_1.LocationValidators.delete(), GlobalMiddleWare_1.GlobalMiddleWare.checkError, LocationController_1.LocationController.delete);
    }
}
exports.default = new LocationRouter().router;
