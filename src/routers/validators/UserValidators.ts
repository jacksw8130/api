import { body, param, query } from "express-validator";
import Party from "../../models/Party";
import User from "../../models/User";
import Ticket from "../../models/Ticket";
import TicketCandidate from "../../models/TicketCandidate";

export class UserValidators{

    static login() {
        return [query('code', 'Code is Required')
            .custom((code, {req}) => {
                return User.findOne({code: code, status:1}).then(user => {
                    if (user) {
                        req.user = user;
                        return true;
                    } else {
                        throw  new Error('User Does Not Exist');
                    }
                });
            }), query('password', 'Password is Required').isString()]
    }

    static passwordForgot(){

        return  [ 
                    body('password', 'Alphanumeric password is Required').isAlphanumeric(),
                    body('code', 'Code Is Required').custom((code, {req})=>{
                        return  User.findOne({code:code}).then(user => {
                                    if(user){
                                        return true;
                                    }else{
                                        throw new Error('User Not Exist');
                                    }
                                })
                    }),
    
                ];
        
    }

    static passwordChange(){

        return  [ 
                    body('password', 'password is Required').isString(),
                    body('old_password', 'Old password is Required').isString().custom((old_password, {req})=>{
                        return  User.findOne({_id:req.user.user_id}).then(user => {
                                    if(user){
                                        req.user_data=user;
                                        return true;
                                    }else{
                                        throw new Error('User Not Exist');
                                    }
                                })
                    }),
    
                ];
        
    }

    static deleteUser() {
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

    static update() {
        return [param('id').custom((id, {req}) => {
            return User.findOne({_id: id}, {__v: 0}).then((user) => {
                if (user) {
                    req.user = user;
                    return true;
                } else {
                    throw new Error('User Does Not Exist');
                }
            })
        })]
    }

    static bid(){

        return  [ 
                    body('bid_amount', 'bid_amount is Required').isNumeric().custom((bid_amount, {req})=>{
                        return  User.findOne({_id:req.user.user_id, bid_status:true, wallet: { $gte: bid_amount}} ).populate('admin_id').then(user => {
                                    if(user){
                                        if(user['admin_id']['bid_status']==true){
                                            return true;
                                        }else{
                                            throw new Error('Contact Admin regarding bid ban');
                                        }
                                       
                                    }else{
                                        throw new Error('Low Balance / Bid Ban');
                                    }
                                })
                    }),
                    body('yes_or_no', 'yes_or_no is Required'),
                    body('seat', 'seat is Required'),
                    body('winning_percentage', 'winning_percentage is Required'),
                    body('ticket_type', 'ticket_type is Required'),
                    body('ticket_id', 'ticket_id Is Required').custom((ticket_id, {req})=>{
                        return  Ticket.findOne({_id:ticket_id, status:true, expire:false, result_declare_status:false}).populate({path:"party_id", populate: { path: "state_id" } }).then(async ticket => {
                                    if(ticket){
                                        if(ticket['bid_status']==true && ticket['party_id']['state_id']['bid_status']==true){
                                            if(req.body.bid_amount>=ticket['min_bid'] && req.body.bid_amount<=ticket['max_bid']){
                                                return true;
                                            }else{
                                                throw new Error("Bid Amount should be in between min_bid & max_bid");
                                            }
                                        }else{
                                            throw new Error("OOPs! Ticket Suspended");
                                        }
                                        
                                        
                                    }else{
                                        throw new Error('Ticket expire');
                                    }
                                })
                    }),
                ];
        
    }

    static bid_candidate(){

        return  [ 
                    body('bid_amount', 'bid_amount is Required').isNumeric().custom((bid_amount, {req})=>{
                        return  User.findOne({_id:req.user.user_id, bid_status:true, wallet: { $gte: bid_amount}} ).populate('admin_id').then(user => {
                                    if(user){
                                        if(user['admin_id']['bid_status']==true){
                                            return true;
                                        }else{
                                            throw new Error('Contact Admin regarding bid ban');
                                        }
                                       
                                    }else{
                                        throw new Error('Low Balance / Bid Ban');
                                    }
                                })
                    }),
                    body('yes_or_no', 'yes_or_no is Required'),
                    body('winning_percentage', 'winning_percentage is Required'),
                    body('ticket_type', 'ticket_type is Required'),
                    body('ticket_id', 'ticket_id Is Required').custom((ticket_id, {req})=>{
                        return  TicketCandidate.findOne({_id:ticket_id, status:true, expire:false, result_declare_status:false}).populate([{path:"state_id" },{path:"location_id" },{path:"candidate_id" }]).then(ticketCandidate => {
                            if(ticketCandidate){
                                if(ticketCandidate['candidate_id']['bid_status']==true && ticketCandidate['location_id']['bid_status']==true){
                                    if(req.body.bid_amount>=ticketCandidate['min_bid'] && req.body.bid_amount<=ticketCandidate['max_bid']){
                                        return true;
                                    }else{
                                        throw new Error("Bid Amount should be in between min_bid & max_bid");
                                    }
                                }else{
                                    throw new Error("OOPs! Ticket Suspended");
                                }     
                            }else{
                                throw new Error('Ticket expire');
                            }
                        })
                    }),
                ];
        
    }


} 