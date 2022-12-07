import Bid from "../models/Bid";
import Party from "../models/Party";
import Ticket from "../models/Ticket";
import User from "../models/User";
import WalletTransaction from "../models/WalletTransaction";
import { Utils } from "../utils/Utils";

export class PartyController {

    static async create(req, res, next){  

        try {

            let party:any = await new Party(req.body).save();
            res.json({
                message:'Party Save Successfully',
                data:party,
                status_code:200
            });

        } catch (e) {
            next(e)
        }
        
   
    }

    static async update(req, res, next) {
        const PartyId = req.party._id;
        try {
            const party = await Party.findOneAndUpdate({_id: PartyId}, req.body, {new: true, useFindAndModify: false});
            res.json({
                message:'Party Updated Successfully',
                data:party,
                status_code:200
            });
        } catch (e) {
            next(e);
        }

    }

    static async resultOld(req, res, next) {
        const partyId = req.party._id;
        try {

            // update party winning_seats
            const party = await Party.findOneAndUpdate({_id: partyId}, {winning_seats:req.body.winning_seats, result_declare_status:true}, {new: true, useFindAndModify: false});
            if(party){
                let party_winning_seats = party['winning_seats'];
                if(party_winning_seats){

                    // All ticket of this party
                    let tickets = await Ticket.find({party_id:party['_id']}, {__v: 0});

                    for (const ticket of tickets) {

                        await Ticket.findOneAndUpdate({_id: ticket['_id']}, {result_declare_status:true,expire:true}, {new: true, useFindAndModify: false});

                        const bids = await Bid.find({ticket_type:"tickets",ticket_id: ticket['_id'],result_declare_status:false,bid_status:"pending"});
                        for (const bid of bids) {
                            var user_data = await User.findOne({_id: bid['user_id']});
                            // update yes_seats
                            if(bid['yes_or_no']=="yes"){
                                if(party_winning_seats>=bid['seat']){
                                    // bid + winning amount

                                    let winning_amount = bid['bid_amount']*bid['winning_percentage']/100;
                                    let total_amount = bid['bid_amount']+(bid['bid_amount']*bid['winning_percentage'])/100;
                                    let to_balance=user_data.wallet+total_amount;
                                    // update bid
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result:true, result_declare_status:true, winning_amount:winning_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
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
                                         await User.findOneAndUpdate({_id: bid['user_id']}, { $inc: { wallet: total_amount} }, {new: true, useFindAndModify: false});
                                    }
                                }else{
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result:false, result_declare_status:true, winning_amount:0,bid_status:"loss"}, {new: true, useFindAndModify: false});
                                }
                            }else{
                                if(party_winning_seats<bid['seat']){
                                    let winning_amount = bid['bid_amount'];
                                    let total_amount = bid['bid_amount']+(bid['bid_amount']*bid['winning_percentage'])/100;
                                    let to_balance=user_data.wallet+total_amount;
                                    // update bid
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result:true,result_declare_status:true, winning_amount:winning_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
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
                                        await User.findOneAndUpdate({_id: bid['user_id']}, { $inc: { wallet: total_amount} }, {new: true, useFindAndModify: false});
                                    }
                                }else{
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result:true,result_declare_status:true, winning_amount:0,bid_status:"loss"}, {new: true, useFindAndModify: false});
                                }
                            }   
                        }

                    }
                }
                
            }
            res.json({
                message:'Party Result Declared Successfully',
                data:party,
                status_code:200
            });
        } catch (e) {
            next(e);
        }
    }

    static async result(req, res, next) {
        const partyId = req.party._id;
        try {

            // update party winning_seats
            const party = await Party.findOneAndUpdate({_id: partyId}, {winning_seats:req.body.winning_seats, result_declare_status:true}, {new: true, useFindAndModify: false});
            if(party){
                let party_winning_seats = party['winning_seats'];
                if(party_winning_seats){

                    // All ticket of this party
                    let tickets = await Ticket.find({party_id:party['_id']}, {__v: 0});

                    for (const ticket of tickets) {
                        // update ticket declare status
                        await Ticket.findOneAndUpdate({_id: ticket['_id']}, {result_declare_status:true,expire:true}, {new: true, useFindAndModify: false});

                        // find all users who bid in this ticket
                        let user_id_array=[];
                        let ubids = await Bid.aggregate([
                            { $match: {ticket_type:"tickets",  ticket_id:ticket['_id']} },
                            { $group: { _id: { user_id: "$user_id" }} }
                        ]);
                        for (let ubid of ubids) {
                            user_id_array.push(ubid['_id']['user_id']);
                        }

                        // ticket result per user wise
                        for (const user_id of user_id_array) {
                            let winning_amount=0;
                            let user_data = await User.findOne({_id: user_id});
                            const bids = await Bid.find({ticket_type:"tickets",ticket_id: ticket['_id'],user_id: user_id,result_declare_status:false,bid_status:"pending"});
                            for (const bid of bids) {
                                
                                // update yes_seats
                                if(bid['yes_or_no']=="yes"){
                                    if(party_winning_seats>=bid['seat']){
                                        // winning amount
                                        let win_amount = bid['bid_amount']*bid['winning_percentage']/100;
                                        winning_amount+=win_amount;
                                        // update bid
                                        await Bid.findOneAndUpdate({_id: bid['_id']}, {result:true, result_declare_status:true, winning_amount:win_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
                                        
                                    }else{
                                        // loss amount
                                        let loss_amount = bid['bid_amount'];
                                        winning_amount-=loss_amount;
                                        // update bid
                                        await Bid.findOneAndUpdate({_id: bid['_id']}, {result:false, result_declare_status:true, winning_amount:-loss_amount,bid_status:"loss"}, {new: true, useFindAndModify: false});
                                    }
                                }else{
                                    if(party_winning_seats<bid['seat']){
                                        // winning amount
                                        let win_amount = bid['bid_amount'];
                                        winning_amount+=win_amount;
                                        // update bid
                                        await Bid.findOneAndUpdate({_id: bid['_id']}, {result:true,result_declare_status:true, winning_amount:win_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
                                        
                                    }else{
                                        // loss amount
                                        let loss_amount = bid['bid_amount']*bid['winning_percentage']/100;
                                        winning_amount-=loss_amount;
                                        // update bid
                                        await Bid.findOneAndUpdate({_id: bid['_id']}, {result:true,result_declare_status:true, winning_amount:-loss_amount,bid_status:"loss"}, {new: true, useFindAndModify: false});
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
                                ticket_type: "tickets",
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
                message:'Party Result Declared Successfully',
                data:party,
                status_code:200
            });
        } catch (e) {
            next(e);
        }
    }


    static async Party(req, res, next){
        const party = req.party;
        const data = {
            message : 'Success',
            data:party
        };
        res.json(data);
    }

    static async stateParty(req, res, next){
        const party = req.party;
        const data = {
            message : 'Success',
            data:party
        };
        res.json(data);
    }

    static async allParty(req, res, next){

        try {
            const party = await Party.find({status:true}, {__v: 0}).populate({path:"state_id"});
            const data = {
                message : 'Success',
                data:party
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async allOwnerParty(req, res, next){

        try {
            const party = await Party.find();
            const data = {
                message : 'Success',
                data:party
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }


    static async delete(req, res, next) {
        const party = req.party;
        try {
            await party.remove();
            res.json({
                message:'Success ! Party Deleted Successfully',
                status_code: 200
            });
        } catch (e) {
            next(e);
        }
    }

} 