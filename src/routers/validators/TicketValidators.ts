import { body, param, query } from "express-validator";
import Party from "../../models/Party";

import Ticket from "../../models/Ticket";

export class TicketValidators{

    static create(){

        return  [   
                    body('name', 'name Is Required'),
                    body('party_id', 'party_id Is Required').custom((party_id, {req})=>{
                        return  Party.findOne({_id:party_id}).then(party => {
                                    if(party){
                                        return true;
                                    }else{
                                        throw new Error("Party Doesn't Exist");
                                    }
                                })
                    }),
                    body('yes_winning_percent', 'yes_winning_percent Is Required'),
                    body('yes_seats', 'yes_seats Is Required'),
                    body('no_winning_percent', 'no_winning_percent Is Required'),
                    body('no_seats', 'no_seats Is Required'),
                    body('min_bid', 'min_bid Is Required'),
                    body('max_bid', 'max_bid Is Required')
    
                ];
        
    }

    static Ticket() {
        return [param('id').custom((id, {req}) => {
            return Ticket.findOne({_id: id}, {__v: 0}).populate([
                {path:"party_id"},
                {path:"bid_count"},
                {path:"bids"}
            ]).then((ticket) => {
                if (ticket) {
                    req.ticket = ticket;
                    return true;
                } else {
                    throw new Error('Ticket Does Not Exist');
                }
            })
        })]
    }

    static partyTicket() {
        return [param('id').custom((id, {req}) => {
            return Ticket.find({party_id: id}, {__v: 0}).populate([{path:"party_id"},{path:"bids"}]).then((ticket) => {
                if (ticket) {
                    req.ticket = ticket;
                    return true;
                } else {
                    throw new Error('Ticket Does Not Exist');
                }
            })
        })]
    }

    static update() {
        return [param('id').custom((id, {req}) => {
            return Ticket.findOne({_id: id}, {__v: 0}).then((ticket) => {
                if (ticket) {
                    req.ticket = ticket;
                    return true;
                } else {
                    throw new Error('Ticket Does Not Exist');
                }
            })
        })]
    }

    static delete() {
        return [param('id').custom((id, {req}) => {
            return Ticket.findOne({_id: id}, {__v: 0}).then((ticket) => {
                if (ticket) {
                    req.ticket = ticket;
                    return true;
                } else {
                    throw new Error('Ticket Does Not Exist');
                }
            })
        })]
    }


}