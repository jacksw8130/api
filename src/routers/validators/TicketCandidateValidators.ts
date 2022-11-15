import { body, param, query } from "express-validator";
import State from "../../models/State";
import Candidate from "../../models/Candidate";

import TicketCandidate from "../../models/TicketCandidate";
import Location from "../../models/Location";

export class TicketCandidateValidators{

    static create(){

        return  [   
                    body('state_id', 'state_id Is Required').custom((state_id, {req})=>{
                        return  State.findOne({_id:state_id}).then(state => {
                                    if(state){
                                        return true;
                                    }else{
                                        throw new Error("State Doesn't Exist");
                                    }
                                })
                    }),
                    body('location_id', 'location_id Is Required').custom((location_id, {req})=>{
                        return  Location.findOne({_id:location_id}).then(location => {
                                    if(location){
                                        return true;
                                    }else{
                                        throw new Error("location Doesn't Exist");
                                    }
                                })
                    }),
                    body('candidate_id', 'candidate_id Is Required').custom((candidate_id, {req})=>{
                        return  Candidate.findOne({_id:candidate_id}).then(candidate => {
                                    if(candidate){
                                        return true;
                                    }else{
                                        throw new Error("candidate Doesn't Exist");
                                    }
                                })
                    }),
                    body('yes_winning_percent', 'yes_winning_percent Is Required').custom((yes_winning_percent, {req})=>{
                        return  TicketCandidate.findOne({candidate_id:req.body.candidate_id}).then(ticketCandidate => {
                                    if(ticketCandidate){
                                        throw new Error("Ticket for this candidate already exist");
                                    }else{
                                        return true;
                                    }
                                })
                    }),
                    body('no_winning_percent', 'no_winning_percent Is Required'),
                    body('min_bid', 'min_bid Is Required'),
                    body('max_bid', 'max_bid Is Required')
    
                ];
        
    }

    static TicketCandidate() {
        return [param('id').custom((id, {req}) => {
            return TicketCandidate.findOne({_id: id}, {__v: 0}).populate([
                {path:"state_id"},
                {path:"candidate_id"},
                {path:"location_id"},
                {path:"bid_count"},
                {path:"bids"}
            ]).then((ticketCandidate) => {
                if (ticketCandidate) {
                    req.ticketCandidate = ticketCandidate;
                    return true;
                } else {
                    throw new Error('TicketCandidate Does Not Exist');
                }
            })
        })]
    }

    static stateTicketCandidate() {
        return [param('id').custom((id, {req}) => {
            return TicketCandidate.find({candidate_id: id}, {__v: 0}).populate([{path:"state_id"},{path:"candidate_id"},{path:"location_id"},{path:"bids"}]).then((ticketCandidate) => {
                if (ticketCandidate) {
                    req.ticketCandidate = ticketCandidate;
                    return true;
                } else {
                    throw new Error('TicketCandidate Does Not Exist');
                }
            })
        })]
    }

    static stateTicket() {
        return [param('id').custom((id, {req}) => {
            return State.findOne({_id: id}, {__v: 0}).then((state) => {
                if (state) {
                    req.state = state;
                    return true;
                } else {
                    throw new Error('State Does Not Exist');
                }
            })
        })]
    }

    static locationTicket() {
        return [param('id').custom((id, {req}) => {
            return Location.findOne({_id: id}, {__v: 0}).then((location) => {
                if (location) {
                    req.location = location;
                    return true;
                } else {
                    throw new Error('Location Does Not Exist');
                }
            })
        })]
    }

    static update() {
        return [param('id').custom((id, {req}) => {
            return TicketCandidate.findOne({_id: id}, {__v: 0}).then((ticketCandidate) => {
                if (ticketCandidate) {
                    req.ticketCandidate = ticketCandidate;
                    return true;
                } else {
                    throw new Error('TicketCandidate Does Not Exist');
                }
            })
        })]
    }

    static delete() {
        return [param('id').custom((id, {req}) => {
            return TicketCandidate.findOne({_id: id}, {__v: 0}).then((ticketCandidate) => {
                if (ticketCandidate) {
                    req.ticketCandidate = ticketCandidate;
                    return true;
                } else {
                    throw new Error('TicketCandidate Does Not Exist');
                }
            })
        })]
    }


}