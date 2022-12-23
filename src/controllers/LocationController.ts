import Bid from "../models/Bid";
import Location from "../models/Location";
import Ticket from "../models/Ticket";
import TicketCandidate from "../models/TicketCandidate";
import User from "../models/User";
import WalletTransaction from "../models/WalletTransaction";
import { Utils } from "../utils/Utils";

export class LocationController {

    static async create(req, res, next){  

        try {

            let location:any = await new Location(req.body).save();
            res.json({
                message:'Location Save Successfully',
                data:location,
                status_code:200
            });

        } catch (e) {
            next(e)
        }
        
   
    }

    static async update(req, res, next) {
        const LocationId = req.location._id;
        try {
            const location = await Location.findOneAndUpdate({_id: LocationId}, req.body, {new: true, useFindAndModify: false});
            res.json({
                message:'Location Updated Successfully',
                data:location,
                status_code:200
            });
        } catch (e) {
            next(e);
        }

    }

    static async resultOld(req, res, next) {
        const locationId = req.location._id;
        try {

            // update location winning_seats
            const location = await Location.findOneAndUpdate({_id: locationId}, {candidate_winner_id:req.body.candidate_winner_id, result_declare_status:true}, {new: true, useFindAndModify: false});
            if(location){
                let candidate_winner_id = location['candidate_winner_id'];
                if(candidate_winner_id){

                    // All ticket of this location
                    let tickets = await TicketCandidate.find({location_id:location['_id']}, {__v: 0});

                    for (const ticket of tickets) {

                        // update yes/no result
                        if(ticket['candidate_id']==candidate_winner_id){
                            await TicketCandidate.findOneAndUpdate({_id: ticket['_id']}, {yes_result:true, no_result:false, result_declare_status:true}, {new: true, useFindAndModify: false});
                        }else{
                            await TicketCandidate.findOneAndUpdate({_id: ticket['_id']}, {yes_result:false, no_result:true, result_declare_status:true}, {new: true, useFindAndModify: false});
                        }   

                        // Bid/Transaction Update
                        const bids = await Bid.find({ticket_type:"ticket_candidates",ticket_id: ticket._id,result_declare_status:false,bid_status:"pending"});
                        for (const bid of bids) {
                            var user_data = await User.findOne({_id: bid['user_id']});
                            // update yes_seats
                            if(bid['yes_or_no']=="yes"){
                                if(ticket['yes_result']==true){
                                    let winning_amount = bid['bid_amount']*bid['winning_percentage']/100;
                                    let total_amount = bid['bid_amount']+(bid['bid_amount']*bid['winning_percentage'])/100;
                                    let to_balance=user_data.wallet+winning_amount;
                                    // update bid
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:winning_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
                                    // create transaction
                                    const idata = {
                                        to: 'users',
                                        to_id: bid['user_id'],
                                        to_balance: to_balance,
                                        mode: "winning",
                                        coins: total_amount,
                                        bid_id: bid['_id'],
                                        created_at: new Utils().indianTimeZone,
                                        updated_at: new Utils().indianTimeZone
                                    };
                                    let walletTransaction = await new WalletTransaction(idata).save();
                                    if(walletTransaction){
                                        var user_wallet = await User.findOneAndUpdate({_id: bid['user_id']}, { $inc: { wallet: total_amount} }, {new: true, useFindAndModify: false});
                                    }
                                }else{
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:0,bid_status:"loss"}, {new: true, useFindAndModify: false});
                                }
                            }else{
                                if(ticket['no_result']==true){
                                    let winning_amount = bid['bid_amount']*bid['winning_percentage']/100;
                                    let total_amount = bid['bid_amount']+(bid['bid_amount']*bid['winning_percentage'])/100;
                                    let to_balance=user_data.wallet+winning_amount;
                                    // update bid
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:winning_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
                                    // create transaction
                                    const idata = {
                                        to: 'users',
                                        to_id: bid['user_id'],
                                        to_balance: to_balance,
                                        mode: "winning",
                                        coins: total_amount,
                                        bid_id: bid['_id'],
                                        created_at: new Utils().indianTimeZone,
                                        updated_at: new Utils().indianTimeZone
                                    };
                                    let walletTransaction = await new WalletTransaction(idata).save();
                                    if(walletTransaction){
                                        var user_wallet = await User.findOneAndUpdate({_id: bid['user_id']}, { $inc: { wallet: total_amount} }, {new: true, useFindAndModify: false});
                                    }
                                }else{
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:0,bid_status:"loss"}, {new: true, useFindAndModify: false});
                                }
                            }   
                        }

                    }
                }
                
            }
            res.json({
                message:'Location Result Declared Successfully',
                data:location,
                status_code:200
            });
        } catch (e) {
            next(e);
        }
    }

    static async result(req, res, next) {
        const locationId = req.location._id;
        try {

            // update location winning_seats
            const location = await Location.findOneAndUpdate({_id: locationId}, {candidate_winner_id:req.body.candidate_winner_id, result_declare_status:true}, {new: true, useFindAndModify: false});
            if(location){
                let candidate_winner_id = location['candidate_winner_id'];
                if(candidate_winner_id){

                    // All ticket of this location
                    let tickets = await TicketCandidate.find({location_id:location['_id']}, {__v: 0});

                    for (let ticket of tickets) {

                        // update yes/no result
                        if(String(ticket['candidate_id'])==String(candidate_winner_id)){
                            ticket = await TicketCandidate.findOneAndUpdate({_id: ticket['_id']}, {yes_result:true, no_result:false, result_declare_status:true}, {new: true, useFindAndModify: false});
                        }else{
                            ticket = await TicketCandidate.findOneAndUpdate({_id: ticket['_id']}, {yes_result:false, no_result:true, result_declare_status:true}, {new: true, useFindAndModify: false});
                        }   
                        console.log(ticket['yes_result']);

                        // find all users who bid in this ticket
                        let user_id_array=[];
                        let ubids = await Bid.aggregate([
                            { $match: {ticket_type:"ticket_candidates",  ticket_id:ticket['_id']} },
                            { $group: { _id: { user_id: "$user_id" }} }
                        ]);
                        for (let ubid of ubids) {
                            user_id_array.push(ubid['_id']['user_id']);
                        }

                        // ticket result per user wise
                        for (const user_id of user_id_array) {
                            let winning_amount=0;
                            let user_data = await User.findOne({_id: user_id});

                            // Bid/Transaction Update
                            const bids = await Bid.find({ticket_type:"ticket_candidates",ticket_id: ticket._id,result_declare_status:false,bid_status:"pending"});
                            for (const bid of bids) {
                                // update yes_seats
                                console.log(bid['yes_or_no']);
                                console.log(ticket['yes_result']);
                                if(bid['yes_or_no']=="yes"){
                                    if(ticket['yes_result']==true){
                                        // winning amount
                                        let win_amount = bid['bid_amount']*bid['winning_percentage']/100;
                                        winning_amount+=win_amount;
                                        // update bid
                                        await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:win_amount,bid_status:"win"}, {new: true, useFindAndModify: false});

                                    }else{
                                        // loss amount
                                        let loss_amount = bid['bid_amount'];
                                        winning_amount-=loss_amount;
                                        // update bid
                                        await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:-loss_amount,bid_status:"loss"}, {new: true, useFindAndModify: false});
                                    }
                                }else{
                                    if(ticket['no_result']==true){
                                        // winning amount
                                        let win_amount = bid['bid_amount'];
                                        winning_amount+=win_amount;
                                        // update bid
                                        await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:win_amount,bid_status:"win"}, {new: true, useFindAndModify: false});

                                    }else{
                                        // loss amount
                                        let loss_amount = bid['bid_amount']*bid['winning_percentage']/100;
                                        winning_amount-=loss_amount;
                                        // update bid
                                        await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:-loss_amount,bid_status:"loss"}, {new: true, useFindAndModify: false});
                                    }
                                }   
                            }

                            // create transaction
                            let to_balance=user_data['balance']+winning_amount;
                            const idata = {
                                to: 'users',
                                to_id: user_id,
                                to_balance: to_balance,
                                mode: "bidding",
                                coins: winning_amount,
                                ticket_id: ticket['_id'],
                                ticket_type: "ticket_candidates",
                                created_at: new Utils().indianTimeZone,
                                updated_at: new Utils().indianTimeZone
                            };
                            let walletTransaction = await new WalletTransaction(idata).save();
                            if(walletTransaction){
                                await User.findOneAndUpdate({_id: user_id}, { $inc: { balance: winning_amount} }, {new: true, useFindAndModify: false});
                            }


                        }

                    }
                }
                
            }
            res.json({
                message:'Location Result Declared Successfully',
                data:location,
                status_code:200
            });
        } catch (e) {
            next(e);
        }
    }

    static async Location(req, res, next){
        const location = req.location;
        const data = {
            message : 'Success',
            data:location
        };
        res.json(data);
    }

    static async stateLocation(req, res, next){
        const location = req.location;
        const data = {
            message : 'Success',
            data:location
        };
        res.json(data);
    }

    static async allLocation(req, res, next){

        try {
            const location = await Location.find({status:true}, {__v: 0}).populate({path:"state_id"});
            const data = {
                message : 'Success',
                data:location
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async allOwnerLocation(req, res, next){

        try {
            const location = await Location.find();
            const data = {
                message : 'Success',
                data:location
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }


    static async delete(req, res, next) {
        const location = req.location;
        try {
            await location.remove();
            res.json({
                message:'Success ! Location Deleted Successfully',
                status_code: 200
            });
        } catch (e) {
            next(e);
        }
    }

} 