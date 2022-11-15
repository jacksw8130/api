import Party from "../models/Party";
import State from "../models/State";
import Ticket from "../models/Ticket";
import { Utils } from "../utils/Utils";

export class StateController {

    static async create(req, res, next){  

        try {

            let state:any = await new State(req.body).save();
            res.json({
                message:'State Save Successfully',
                data:state,
                status_code:200
            });

        } catch (e) {
            next(e)
        }
        
   
    }

    static async update(req, res, next) {
        const StateId = req.state._id;
        try {
            const state = await State.findOneAndUpdate({_id: StateId}, req.body, {new: true, useFindAndModify: false});
            res.json({
                message:'State Updated Successfully',
                data:state,
                status_code:200
            });
        } catch (e) {
            next(e);
        }

    }

    static async State(req, res, next){
        const state = req.state;
        const data = {
            message : 'Success',
            data:state
        };
        res.json(data);
    }

    static async allState(req, res, next){

        try {
            const state = await State.find({status:true}, {__v: 0});
            const data = {
                message : 'Success',
                data:state
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async allStateWithTicket(req, res, next){

        try {
            const state = await State.find({status:true}, {__v: 0});
            let state_array =[];
            for(let data of state){
                let myData:object = data.toObject();
                myData['tickets']=[];
                const parties = await Party.find({state_id:myData['_id'], status:true}, {__v: 0});
                for (const party of parties) {
                    let tickets=await Ticket.find({party_id:party['_id'], status:true}, {__v: 0}).sort({created_at: -1}).populate('party_id');
                    myData['tickets'] = [...myData['tickets'], ...tickets];
                }
                state_array.push(myData);
            }

            const data = {
                message : 'Success',
                data:state_array
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async userAllState(req, res, next){

        try {
            const state = await State.find({status:true,bid_status:true}, {__v: 0});
            const data = {
                message : 'Success',
                data:state
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async stateTickets(req, res, next){

        try {
            var total_tickets=[];
            const parties = await Party.find({state_id:req.param.stateId, status:true}, {__v: 0});
            for (const party of parties) {
                let tickets=await Ticket.find({party_id:party['_id'], status:true}, {__v: 0});
                total_tickets.push(tickets);
            }
            const data = {
                message : 'Success',
                data:total_tickets
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }


    static async allOwnerState(req, res, next){

        try {
            const state = await State.find();
            const data = {
                message : 'Success',
                data:state
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }


    static async delete(req, res, next) {
        const state = req.state;
        try {
            await state.remove();
            res.json({
                message:'Success ! State Deleted Successfully',
                status_code: 200
            });
        } catch (e) {
            next(e);
        }
    }

} 