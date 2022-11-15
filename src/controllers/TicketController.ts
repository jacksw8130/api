import Ticket from "../models/Ticket";
import * as moment from "moment-timezone";
import Bid from "../models/Bid";

export class TicketController {

    static async create(req, res, next){  

        try {
            if(req.body.max_bid > req.body.min_bid){
                let ticket:any = await new Ticket(req.body).save();
                res.status(200).json({
                    message:'Ticket Save Successfully',
                    data:ticket,
                    status_code:200
                });
            }else{
                res.status(400).json({
                    message:'max bid should be more than min bid',
                    status_code:400
                });
            }
            

        } catch (e) {
            next(e)
        }
        
   
    }

    static async update(req, res, next) {
        const TicketId = req.ticket._id;
        try {
            const ticket = await Ticket.findOneAndUpdate({_id: TicketId}, req.body, {new: true, useFindAndModify: false});
            res.json({
                message:'Ticket Update Successfully',
                data:ticket,
                status_code:200
            });
        } catch (e) {
            next(e);
        }

    }

    static async ticket(req, res, next){
        const ticket = req.ticket;
        var sum=0;
        if(ticket['bids']){
            for (let bid of ticket['bids']) {
                sum+=bid['bid_amount'];
            }
        }
        
        const data = {
            message : 'Success',
            data:ticket,
            bid_sum:sum
        };
        res.json(data);
    }

    static async ticketBids(req, res, next){
        const bids = await Bid.find({ticket_id:req.ticket._id, ticket_type:"tickets"}, {__v: 0}).populate({path:"user_id"});
        const data = {
            message : 'Success',
            data:bids
        };
        res.json(data);
    }

    static async allTicket(req, res, next){

        try {
            const ticket = await Ticket.find({status:true}, {__v: 0}).populate({path:"party_id", populate: { path: "state_id" } });
            const data = {
                message : 'Success',
                data:ticket
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async allOwnerTicket(req, res, next){

        try {
            const ticket = await Ticket.find().populate({path:"party_id"});
            const data = {
                message : 'Success',
                data:ticket
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }


    static async delete(req, res, next) {
        const ticket = req.ticket;
        try {
            await ticket.remove();
            res.json({
                message:'Success ! Ticket Deleted Successfully',
                status_code: 200
            });
        } catch (e) {
            next(e);
        }
    }

} 