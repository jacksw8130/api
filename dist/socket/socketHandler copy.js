"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketHandler = void 0;
const Bid_1 = require("../models/Bid");
const Candidate_1 = require("../models/Candidate");
const Party_1 = require("../models/Party");
const Location_1 = require("../models/Location");
const State_1 = require("../models/State");
const Ticket_1 = require("../models/Ticket");
const TicketCandidate_1 = require("../models/TicketCandidate");
const User_1 = require("../models/User");
const socketService_1 = require("./socketService");
const Admin_1 = require("../models/Admin");
const WalletTransaction_1 = require("../models/WalletTransaction");
class SocketHandler {
    // io changed to socketService.io
    static connectSocket() {
        socketService_1.socketService.io.on('connection', function (socket) {
            // console.log('New Socket Connected: '+socket.id); 
            socket.on('disconnect', () => {
                // console.log('user disconnected: '+socket.id);
            });
            SocketHandler.uiHandler(socket);
        });
    }
    static uiHandler(socket) {
        // Change Socket
        socket.on('change', (type) => __awaiter(this, void 0, void 0, function* () {
            if (type) {
                socketService_1.socketService.io.emit('change', type);
            }
            else {
                socketService_1.socketService.io.emit('change', 'notfound');
            }
        }));
        // All State
        socket.on('allState', (socket_id) => __awaiter(this, void 0, void 0, function* () {
            let state = yield State_1.default.find({ status: true }, { __v: 0 });
            socketService_1.socketService.io.to(socket_id).emit('allState', state);
        }));
        // Location Via State
        socket.on('locationViaStateId', (data) => __awaiter(this, void 0, void 0, function* () {
            let location = yield Location_1.default.find({ state_id: data.state_id }, { __v: 0 });
            if (location) {
                socketService_1.socketService.io.to(data.socket_id).emit('locationViaStateId', location);
            }
            else {
                socketService_1.socketService.io.to(data.socket_id).emit('locationViaStateId', "No Location Present");
            }
        }));
        // User Data
        socket.on('userData', (data) => __awaiter(this, void 0, void 0, function* () {
            let user = yield User_1.default.findOne({ _id: data.user_id }, { __v: 0 });
            if (user) {
                console.log(data);
                socket.join(data.user_id);
                let myData = user.toObject();
                // State ticket Sum 
                var ticketSum = 0;
                let candidateTicketSum = 0;
                let states = yield State_1.default.find({ status: true }, { __v: 0 });
                for (const state of states) {
                    // state ticket
                    const parties = yield Party_1.default.find({ state_id: state['_id'], status: true, result_declare_status: false }, { __v: 0 });
                    for (const party of parties) {
                        // get ticket total yes or no winning amount
                        let allTicket = yield Ticket_1.default.find({ party_id: party['_id'], status: true }, { __v: 0 }).populate('party_id').sort({ created_at: -1 });
                        for (const aticket of allTicket) {
                            let bidValue = 0;
                            let abids = yield Bid_1.default.find({ user_id: data.user_id, ticket_type: "tickets", ticket_id: aticket['_id'] }).sort({ created_at: -1 });
                            for (const abid of abids) {
                                if (abid['yes_or_no'] == "yes") {
                                    bidValue += abid['bid_amount'] * abid['winning_percentage'] / 100;
                                }
                                else {
                                    let no_seat = abid['seat'] + 1;
                                    let yebids = yield Bid_1.default.find({ yes_or_no: "yes", seat: { $lte: no_seat }, user_id: data.user_id, ticket_type: "tickets", ticket_id: aticket['_id'] }).sort({ created_at: -1 });
                                    if (yebids && yebids.length > 0) {
                                        bidValue -= abid['bid_amount'] * abid['winning_percentage'] / 100;
                                    }
                                    else {
                                        bidValue += abid['bid_amount'] * abid['winning_percentage'] / 100;
                                    }
                                }
                            }
                            if (bidValue < 0) {
                                bidValue = bidValue * -1;
                            }
                            ticketSum += bidValue;
                        }
                    }
                    // candidate tickets
                    let cStateExposure = 0;
                    let locations = yield Location_1.default.find({ state_id: state['_id'] }, { __v: 0 });
                    for (const location of locations) {
                        let myData = location.toObject();
                        let locationExposure = 0;
                        const candidates = yield Candidate_1.default.find({ location_id: myData['_id'], status: true }, { __v: 0 });
                        for (const candidate of candidates) {
                            // get ticket total yes or no winning amount
                            let mainValue = 0;
                            let allTicket = yield TicketCandidate_1.default.find({ candidate_id: candidate['_id'], status: true }, { __v: 0 }).sort({ created_at: -1 });
                            for (const aticket of allTicket) {
                                let abids = yield Bid_1.default.find({ user_id: data.user_id, ticket_type: "ticket_candidates", ticket_id: aticket['_id'] }).sort({ created_at: -1 });
                                for (let abid of abids) {
                                    if (abid['yes_or_no'] == "yes") {
                                        mainValue += abid['bid_amount'] * aticket['yes_winning_percent'] / 100;
                                    }
                                    else {
                                        mainValue -= abid['bid_amount'] * aticket['no_winning_percent'] / 100;
                                    }
                                }
                            }
                            // subtract other candidate ticket of same location value
                            let allOtherTicket = yield TicketCandidate_1.default.find({ candidate_id: { $ne: candidate['_id'] }, location_id: myData["_id"], status: true }, { __v: 0 }).sort({ created_at: -1 });
                            for (const oticket of allOtherTicket) {
                                let ybids = yield Bid_1.default.find({ user_id: data.user_id, ticket_type: "ticket_candidates", ticket_id: oticket['_id'] }).sort({ created_at: -1 }).populate('ticket_id');
                                for (let ybid of ybids) {
                                    if (ybid['yes_or_no'] == "yes") {
                                        mainValue -= ybid['bid_amount'];
                                    }
                                    else {
                                        mainValue += ybid['bid_amount'];
                                    }
                                }
                            }
                            if (mainValue < 0) {
                                mainValue = mainValue * -1;
                            }
                            if (mainValue > locationExposure) {
                                locationExposure = mainValue;
                            }
                        }
                        cStateExposure += locationExposure;
                    }
                    candidateTicketSum += cStateExposure;
                }
                myData['ticketSum'] = ticketSum;
                myData['candidateTicketSum'] = candidateTicketSum;
                // total exposure
                myData['exposure'] = ticketSum + candidateTicketSum;
                socketService_1.socketService.io.in(data.user_id).emit('userData', myData);
            }
            else {
                socketService_1.socketService.io.in(data.user_id).emit('userData', "No User Present");
            }
        }));
        // admin data
        socket.on('adminData', (data) => __awaiter(this, void 0, void 0, function* () {
            let admin = yield Admin_1.default.findOne({ _id: data.admin_id }, { __v: 0 });
            if (admin) {
                console.log(data);
                let myData = admin.toObject();
                socket.join(data.admin_id);
                // total deposit
                const depositTransactions = yield WalletTransaction_1.default.find({ to_id: admin['_id'], mode: "transfer" });
                var dt = 0;
                for (const depositTransaction of depositTransactions) {
                    dt += depositTransaction['coins'];
                }
                myData['total_deposit'] = dt;
                // total transfer
                const transferTransactions = yield WalletTransaction_1.default.find({ from_id: admin['_id'], mode: "transfer" });
                var tt = 0;
                for (const transferTransaction of transferTransactions) {
                    tt += transferTransaction['coins'];
                }
                myData['total_transfer'] = tt;
                socketService_1.socketService.io.in(data.admin_id).emit('adminData', myData);
            }
            else {
                socketService_1.socketService.io.in(data.admin_id).emit('adminData', "No admin Present");
            }
        }));
        // state wise tickets for users
        socket.on('partyStatewise', (data) => __awaiter(this, void 0, void 0, function* () {
            let state = yield State_1.default.findOne({ _id: data.state_id, status: true }, { __v: 0 });
            if (state) {
                let myData = state.toObject();
                myData['tickets'] = [];
                const parties = yield Party_1.default.find({ state_id: state['_id'], status: true }, { __v: 0 });
                let party_id_array = [];
                for (const party of parties) {
                    party_id_array.push(party['_id']);
                    // get ticket total yes or no winning amount
                    let allTicket = yield Ticket_1.default.find({ party_id: party['_id'], status: true }, { __v: 0 }).populate('party_id').sort({ created_at: -1 });
                    for (const aticket of allTicket) {
                        let amyData = aticket.toObject();
                        let bidValue = 0;
                        let abids = yield Bid_1.default.find({ user_id: data.user_id, ticket_type: "tickets", ticket_id: aticket['_id'] }).sort({ created_at: -1 });
                        for (const abid of abids) {
                            if (abid['yes_or_no'] == "yes") {
                                bidValue += abid['bid_amount'] * abid['winning_percentage'] / 100;
                            }
                            else {
                                let no_seat = abid['seat'] + 1;
                                let yebids = yield Bid_1.default.find({ yes_or_no: "yes", seat: { $lte: no_seat }, user_id: data.user_id, ticket_type: "tickets", ticket_id: aticket['_id'] }).sort({ created_at: -1 });
                                if (yebids && yebids.length > 0) {
                                    bidValue -= abid['bid_amount'] * abid['winning_percentage'] / 100;
                                }
                                else {
                                    bidValue += abid['bid_amount'] * abid['winning_percentage'] / 100;
                                }
                            }
                        }
                        amyData['bidValue'] = bidValue;
                        myData['tickets'].push(amyData);
                    }
                    //end
                }
                let tickets = yield Ticket_1.default.find({ party_id: { "$in": party_id_array } });
                let ticket_id_array = [];
                for (const ticket of tickets) {
                    ticket_id_array.push(ticket['_id']);
                }
                let bids = yield Bid_1.default.find({ user_id: data.user_id, ticket_type: "tickets", ticket_id: { "$in": ticket_id_array } }).sort({ created_at: -1 }).populate([
                    { path: 'ticket_id', populate: { path: "party_id", populate: { path: "state_id" } } }
                ]);
                myData['bids'] = bids;
                socketService_1.socketService.io.to(data.socket_id).emit('partyStatewise', myData);
            }
            else {
                socketService_1.socketService.io.to(data.socket_id).emit('partyStatewise', "state not exist");
            }
        }));
        // user candidate bids locationwise
        socket.on('candidateLocationwise', (data) => __awaiter(this, void 0, void 0, function* () {
            var location = yield Location_1.default.findOne({ _id: data.location_id, status: true }, { __v: 0 });
            if (location) {
                let myData = location.toObject();
                myData['tickets'] = [];
                const candidates = yield Candidate_1.default.find({ location_id: myData['_id'], status: true }, { __v: 0 });
                let candidate_id_array = [];
                for (const candidate of candidates) {
                    candidate_id_array.push(candidate['_id']);
                    // get ticket total yes or no winning amount
                    let mainValue = 0;
                    let allTicket = yield TicketCandidate_1.default.find({ candidate_id: candidate['_id'], status: true }, { __v: 0 }).sort({ created_at: -1 });
                    for (const aticket of allTicket) {
                        let abids = yield Bid_1.default.find({ user_id: data.user_id, ticket_type: "ticket_candidates", ticket_id: aticket['_id'] }).sort({ created_at: -1 });
                        for (let abid of abids) {
                            if (abid['yes_or_no'] == "yes") {
                                mainValue += abid['bid_amount'] * aticket['yes_winning_percent'] / 100;
                            }
                            else {
                                mainValue -= abid['bid_amount'] * aticket['no_winning_percent'] / 100;
                            }
                        }
                    }
                    // subtract other candidate ticket of same location value
                    let allOtherTicket = yield TicketCandidate_1.default.find({ candidate_id: { $ne: candidate['_id'] }, location_id: data.location_id, status: true }, { __v: 0 }).sort({ created_at: -1 });
                    for (const oticket of allOtherTicket) {
                        let ybids = yield Bid_1.default.find({ user_id: data.user_id, ticket_type: "ticket_candidates", ticket_id: oticket['_id'] }).sort({ created_at: -1 }).populate('ticket_id');
                        for (let ybid of ybids) {
                            if (ybid['yes_or_no'] == "yes") {
                                mainValue -= ybid['bid_amount'];
                            }
                            else {
                                mainValue += ybid['bid_amount'];
                            }
                        }
                    }
                    let tticket = yield TicketCandidate_1.default.findOne({ candidate_id: candidate['_id'], status: true }, { __v: 0 }).sort({ created_at: -1 }).populate('candidate_id');
                    if (tticket) {
                        let amyData = tticket.toObject();
                        amyData['mainValue'] = mainValue;
                        myData['tickets'].push(amyData);
                    }
                }
                let tickets = yield TicketCandidate_1.default.find({ candidate_id: { "$in": candidate_id_array } });
                let ticket_id_array = [];
                for (const ticket of tickets) {
                    ticket_id_array.push(ticket['_id']);
                }
                let bids = yield Bid_1.default.find({ user_id: data.user_id, ticket_type: "ticket_candidates", ticket_id: { "$in": ticket_id_array } }).sort({ created_at: -1 }).populate([
                    { path: 'ticket_id', populate: { path: "candidate_id", populate: { path: "state_id" } } }
                ]);
                myData['bids'] = bids;
                socketService_1.socketService.io.to(data.socket_id).emit('candidateLocationwise', myData);
            }
            else {
                socketService_1.socketService.io.to(data.socket_id).emit('candidateLocationwise', 'Location Not Exist');
            }
        }));
        // // state wise tickets for users
        // socket.on('tickets', async (data)=>{ // state_id, user_id
        //     //let state = await State.find({status:true}, {__v: 0});
        //     let state = await State.findOne({_id:data.state_id, status:true}, {__v: 0});
        //     // let state_array =[];
        //     // for(let data of state){
        //         //let myData:object = data.toObject();
        //         let myData:object = state.toObject();
        //         myData['tickets']=[];
        //         const parties = await Party.find({state_id:myData['_id'], status:true}, {__v: 0});
        //         for (const party of parties) {
        //             // get ticket total yes or no winning amount
        //             let yesValue=0;
        //             let noValue=0;
        //             let allTicket=await Ticket.find({party_id:party['_id'], status:true}, {__v: 0}).sort({created_at: -1})
        //             for (const aticket of allTicket) {
        //                 let abids = await Bid.find({user_id:data.user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({created_at: -1});
        //                 for (const abid of abids) {
        //                     if(abid['yes_or_no']=="yes"){
        //                         yesValue+=abid['bid_amount']*aticket['yes_winning_percent']/100;
        //                     }else {
        //                         noValue+=abid['bid_amount']*aticket['no_winning_percent']/100;
        //                     }
        //                 }
        //             }
        //             //end
        //             let ticket=await Ticket.findOne({party_id:party['_id'], status:true}, {__v: 0}).sort({created_at: -1}).populate('party_id');
        //             if(ticket){
        //                 let amyData = ticket.toObject();
        //                 amyData['yesValue']=yesValue;
        //                 amyData['noValue']=noValue;
        //                 myData['tickets'].push(amyData);
        //             }
        //         }
        //         //state_array.push(myData);
        //     // }
        //     socketService.io.emit('tickets', myData);
        // });
        // // user bids statewise
        // socket.on('userPartyBid', async (data)=>{ // state_id, user_id
        //     let parties = await Party.find({state_id:data.state_id}, {__v: 0});
        //     let party_id_array =[];
        //     for (const party of parties) {
        //         party_id_array.push(party['_id']);
        //     }
        //     let tickets = await Ticket.find({party_id:{ "$in": party_id_array }});
        //     let ticket_id_array =[];
        //     for (const ticket of tickets) {
        //         ticket_id_array.push(ticket['_id']);
        //     }
        //     let bids = await Bid.find({user_id:data.user_id, ticket_type:"tickets", ticket_id:{ "$in": ticket_id_array }}).sort({created_at: -1}).populate([
        //         { path:'ticket_id', populate:{ path: "party_id", populate: { path: "state_id" } }}
        //     ]);
        //    socketService.io.emit('userPartyBid', bids);
        // });
        // // location wise candidate tickets for users
        // socket.on('candidateTickets', async (location_id)=>{ // location_id
        //     let location = await Location.findOne({_id:location_id, status:true}, {__v: 0});
        //     let myData:object = location.toObject();
        //     myData['tickets']=[];
        //     const candidates = await Candidate.find({location_id:myData['_id'], status:true}, {__v: 0});
        //     for (const candidate of candidates) {
        //         let ticket=await TicketCandidate.findOne({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1}).populate('party_id');
        //         if(ticket){
        //             myData['tickets'].push(ticket);
        //         }
        //     }
        //     socketService.io.emit('candidateTickets', myData);
        // });
        // // user candidate bids locationwise
        // socket.on('userBidOnCandidateLocationwise', async (data)=>{ // location_id, user_id
        //     let candidates = await Candidate.find({location_id:data.location_id}, {__v: 0});
        //     let candidate_id_array =[];
        //     for (const candidate of candidates) {
        //         candidate_id_array.push(candidate['_id']);
        //     }
        //     let tickets = await TicketCandidate.find({candidate_id:{ "$in": candidate_id_array }});
        //     let ticket_id_array =[];
        //     for (const ticket of tickets) {
        //         ticket_id_array.push(ticket['_id']);
        //     }
        //     let bids = await Bid.find({user_id:data.user_id, ticket_type:"ticket_candidates", ticket_id:{ "$in": ticket_id_array }}).sort({created_at: -1}).populate([
        //         { path:'ticket_id', populate:{ path: "candidate_id", populate: { path: "state_id" } }}
        //     ]);
        //    socketService.io.emit('userBidOnCandidateLocationwise', bids);
        // });
        // // user candidate bids statewise
        // socket.on('userCandidateBid', async (data)=>{ // state_id, user_id
        //     let candidates = await Candidate.find({state_id:data.state_id}, {__v: 0});
        //     let candidate_id_array =[];
        //     for (const candidate of candidates) {
        //         candidate_id_array.push(candidate['_id']);
        //     }
        //     let tickets = await TicketCandidate.find({candidate_id:{ "$in": candidate_id_array }});
        //     let ticket_id_array =[];
        //     for (const ticket of tickets) {
        //         ticket_id_array.push(ticket['_id']);
        //     }
        //     let bids = await Bid.find({user_id:data.user_id, ticket_type:"ticket_candidates", ticket_id:{ "$in": ticket_id_array }}).sort({created_at: -1}).populate([
        //         { path:'ticket_id', populate:{ path: "candidate_id", populate: { path: "state_id" } }}
        //     ]);
        //    socketService.io.emit('userCandidateBid', bids);
        // });
    }
}
exports.SocketHandler = SocketHandler;
