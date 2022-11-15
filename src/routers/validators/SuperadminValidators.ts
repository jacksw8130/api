import { body, param, query } from "express-validator";
import Superadmin from "../../models/Superadmin";
import Admin from "../../models/Admin";
import Ticket from "../../models/Ticket";
import User from "../../models/User";

export class SuperadminValidators{

    static signup(){

        return  [ 
                    body('name', 'name is Required').isString(),
                    body('password', 'password is Required').isString(),
                    body('code', 'code Is Required').custom((code, {req})=>{
                        return  Superadmin.findOne({code:code}).then(superadmin => {
                                    if(superadmin){
                                        throw new Error('Superadmin Already Exist');
                                    }else{
                                        return true;
                                    }
                                })
                    }),
    
                ];
        
    }

    static createAdmin(){

        return  [ 
                    body('name', 'name is Required').isString(),
                    body('code', 'code is Required').isString().custom((code, {req}) => {
                        return Admin.findOne({code: code}).then(admin => {
                            if (admin) {
                                throw  new Error('Admin Already Exist');
                            } else {
                                return true;
                            }
                        });
                    }),
                    body('password', 'password is Required').isString(),
    
                ];
        
    }

    static checkAdmin(){

        return  [ 
                    body('code', 'code is Required').isString().custom((code, {req}) => {
                        return Admin.findOne({code: code}).then(admin => {
                            if (admin) {
                                throw  new Error('Admin Code Already Exist');
                            } else {
                                return true;
                            }
                        });
                    }),
    
                ];
        
    }

    static login() {
        return [query('code', 'Code is Required')
            .custom((code, {req}) => {
                return Superadmin.findOne({code: code}).then(superadmin => {
                    if (superadmin) {
                        req.superadmin = superadmin;
                        return true;
                    } else {
                        throw  new Error('Superadmin Does Not Exist');
                    }
                });
            }), query('password', 'Password is Required').isAlphanumeric()]
    }

    static updateAdmin() {
        return [param('id').custom((id, {req}) => {
            return Admin.findOne({_id: id}, {__v: 0}).then((admin) => {
                if (admin) {
                    req.admin = admin;
                    return true;
                } else {
                    throw new Error('admin Does Not Exist');
                }
            })
        })]
    }

    static updateUser() {
        return [param('id').custom((id, {req}) => {
            return User.findOne({_id: id}, {__v: 0}).then((user) => {
                if (user) {
                    req.user = user;
                    return true;
                } else {
                    throw new Error('user Does Not Exist');
                }
            })
        })]
    }

    static bidResult() {
        return [param('id').custom((id, {req}) => {
            return Ticket.findOne({_id: id}, {__v: 0}).then((ticket) => {
                if (ticket) {
                    req.ticket = ticket;
                    return true;
                } else {
                    throw new Error('ticket Does Not Exist');
                }
            })
        })]
    }

    static allUser() {
        return [param('id').custom((id, {req}) => {
            return Admin.findOne({_id: id}, {__v: 0}).then((admin) => {
                if (admin) {
                    req.admin = admin;
                    return true;
                } else {
                    throw new Error('admin Does Not Exist');
                }
            })
        })]
    }

    static adminTransaction() {
        return [param('id').custom((id, {req}) => {
            return Admin.findOne({_id: id}, {__v: 0}).then((admin) => {
                if (admin) {
                    req.admin = admin;
                    return true;
                } else {
                    throw new Error('admin Does Not Exist');
                }
            })
        })]
    }

    static userTransaction() {
        return [param('id').custom((id, {req}) => {
            return User.findOne({_id: id}, {__v: 0}).then((user) => {
                if (user) {
                    req.user = user;
                    return true;
                } else {
                    throw new Error('user Does Not Exist');
                }
            })
        })]
    }

    static transfer(){

        return  [ 
                    body('coins', 'coins is Required').isNumeric(),
                    body('admin_id', 'admin_id Is Required').isString().custom((admin_id, {req})=>{
                        return  Admin.findOne({_id:admin_id, super_admin_id:req.superadmin.superadmin_id}).then(admin => {
                                    if(admin){
                                        return true;
                                    }else{
                                        throw new Error('admin not Exist');
                                    }
                                })
                    })
    
                ];
        
    }

    static withdraw(){

        return  [ 
                    body('admin_id', 'admin_id Is Required').isString().custom((admin_id, {req})=>{
                        return  Admin.findOne({_id:admin_id, super_admin_id:req.superadmin.superadmin_id}).then(admin => {
                                    if(admin){
                                        return true;
                                    }else{
                                        throw new Error('admin not Exist');
                                    }
                                })
                    }), 
                    body('coins', 'coins is Required').isNumeric().custom((coins, {req})=>{
                        return  Admin.findOne({_id:req.body.admin_id, wallet: { $gte: coins}} ).then(superadmin => {
                                    if(superadmin){
                                        return true;
                                    }else{
                                        throw new Error('admin wallet not having enough balance');
                                    }
                                })
                    }),
    
                ];
        
    }

} 