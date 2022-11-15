import { body, param, query } from "express-validator";
import Admin from "../../models/Admin";
import User from "../../models/User";
import Superadmin from "../../models/Superadmin";

export class AdminValidators{

    static createUser(){

        return  [ 
                    body('name', 'name is Required').isString(),
                    body('code', 'code is Required').isString().custom((code, {req}) => {
                        return User.findOne({code: code}).then(user => {
                            if (user) {
                                throw  new Error('User Already Exist');
                            } else {
                                return true;
                            }
                        });
                    }),
                    body('password', 'password is Required').isString()
    
                ];
        
    }

    static checkUser(){

        return  [ 
                    body('code', 'code is Required').isString().custom((code, {req}) => {
                        return User.findOne({code: code}).then(user => {
                            if (user) {
                                throw  new Error('User code already exist');
                            } else {
                                return true;
                            }
                        });
                    })
    
                ];
        
    }

    static userTransaction() {
        return [param('id').custom((id, {req}) => {
            return User.findOne({_id: id, admin_id:req.admin.admin_id}, {__v: 0}).then((user) => {
                if (user) {
                    req.user = user;
                    return true;
                } else {
                    throw new Error('user Does Not Exist');
                }
            })
        })]
    }

    static login() {
        return [query('code', 'Code is Required')
            .custom((code, {req}) => {
                return Admin.findOne({code: code}).then(admin => {
                    if (admin) {
                        req.admin = admin;
                        return true;
                    } else {
                        throw  new Error('Admin Does Not Exist');
                    }
                });
            }), query('password', 'Password is Required').isAlphanumeric()]
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

    static transfer(){

        return  [ 
                    body('coins', 'coins is Required').isNumeric().custom((coins, {req})=>{
                        return  Admin.findOne({_id:req.admin.admin_id, wallet: { $gte: coins}} ).then(admin => {
                                    if(admin){
                                        return true;
                                    }else{
                                        throw new Error('admin wallet not having enough balance');
                                    }
                                })
                    }),
                    body('user_id', 'user_id Is Required').isString().custom((user_id, {req})=>{
                        return  User.findOne({_id:user_id, admin_id:req.admin.admin_id}).then(user => {
                                    if(user){
                                        return true;
                                    }else{
                                        throw new Error('user not Exist');
                                    }
                                })
                    })
    
                ];
        
    }

    static withdraw(){

        return  [ 
                    body('user_id', 'user_id Is Required').isString().custom((user_id, {req})=>{
                        return  User.findOne({_id:user_id, admin_id:req.admin.admin_id}).then(user => {
                                    if(user){
                                        return true;
                                    }else{
                                        throw new Error('user not Exist');
                                    }
                                })
                    }), 
                    body('coins', 'coins is Required').isNumeric().custom((coins, {req})=>{
                        return  User.findOne({_id:req.body.user_id, wallet: { $gte: coins}} ).then(user => {
                                    if(user){
                                        return true;
                                    }else{
                                        throw new Error('user wallet not having enough balance');
                                    }
                                })
                    }),
    
                ];
        
    }



} 