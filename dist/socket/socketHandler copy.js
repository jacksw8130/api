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
            socket.join(data.user_id);
            let user = yield User_1.default.findOne({ _id: data.user_id }, { __v: 0 });
            if (user) {
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
                            let min_bids = yield Bid_1.default.findOne({ user_id: data.user_id, ticket_type: "tickets", ticket_id: aticket['_id'] }).sort({ seat: 1 });
                            let max_bids = yield Bid_1.default.findOne({ user_id: data.user_id, ticket_type: "tickets", ticket_id: aticket['_id'] }).sort({ seat: -1 });
                            if (min_bids && max_bids) {
                                let min_num = min_bids['seat'] - 20 > 0 ? min_bids['seat'] - 20 : 1;
                                let max_num = min_bids['seat'] + 20;
                                for (let i = min_num; i <= max_num; i++) {
                                    let exposure = 0;
                                    for (const abid of abids) {
                                        if (abid['yes_or_no'] == "yes") {
                                            if (i >= abid['seat']) {
                                                let add_value = abid['bid_amount'] * abid['winning_percentage'] / 100;
                                                exposure += add_value;
                                            }
                                            else {
                                                exposure -= abid['bid_amount'];
                                            }
                                        }
                                        else {
                                            if (i < abid['seat']) {
                                                exposure += abid['bid_amount'] * 100 / abid['winning_percentage'];
                                            }
                                            else {
                                                let add_value = abid['bid_amount'];
                                                exposure -= add_value;
                                            }
                                        }
                                    }
                                    if (bidValue > exposure) {
                                        bidValue = exposure;
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
                    let locations = yield Location_1.default.find({ state_id: state['_id'], result_declare_status: false }, { __v: 0 });
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
                                        mainValue += abid['bid_amount'] * abid['winning_percentage'] / 100;
                                    }
                                    else {
                                        mainValue -= abid['bid_amount'] * abid['winning_percentage'] / 100;
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
            socket.join(data.admin_id);
            let admin = yield Admin_1.default.findOne({ _id: data.admin_id }, { __v: 0 });
            if (admin) {
                let myData = admin.toObject();
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
        socket.on('partyStatewise_', (data) => __awaiter(this, void 0, void 0, function* () {
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
                        let usedYes = [];
                        let abids = yield Bid_1.default.find({ user_id: data.user_id, ticket_type: "tickets", ticket_id: aticket['_id'] }).sort({ created_at: -1 });
                        for (const abid of abids) {
                            if (abid['yes_or_no'] == "yes") {
                                bidValue += abid['bid_amount'];
                                // }else {
                                //     let no_seat=abid['seat']+1;
                                //     let yebids = await Bid.find({yes_or_no:"yes",seat: { $lte: no_seat}, user_id:data.user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({created_at: -1});
                                //     if(yebids&&yebids.length>0){
                                //         bidValue-=abid['bid_amount']*abid['winning_percentage']/100;
                                //     }else{
                                //         bidValue+=abid['bid_amount']*abid['winning_percentage']/100;
                                //     }
                                // }
                                // }else {
                                //     let no_seat=abid['seat'];
                                //     let yebids = await Bid.find({yes_or_no:"yes",seat: { $lte: no_seat}, user_id:data.user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({created_at: -1});
                                //     if(yebids&&yebids.length>0){
                                //         var yebidval=0;
                                //         for (const yebid of yebids) {
                                //             bidValue-=yebid['bid_amount']*yebid['winning_percentage']/100;
                                //             yebidval+=yebid['bid_amount']*yebid['winning_percentage']/100
                                //         }
                                //         yebidval-=abid['bid_amount']*abid['winning_percentage']/100;
                                //         if(yebidval<0)
                                //         {
                                //             yebidval=yebidval*-1;
                                //         }
                                //         bidValue+=yebidval;
                                //     }else{
                                //         bidValue+=abid['bid_amount']*abid['winning_percentage']/100;
                                //     }
                                // }
                            }
                            else {
                                let no_seat = abid['seat'];
                                let yebid = yield Bid_1.default.findOne({ yes_or_no: "yes", seat: { $lte: no_seat }, user_id: data.user_id, ticket_type: "tickets", ticket_id: aticket['_id'], _id: { "$nin": usedYes } }).sort({ created_at: -1 });
                                //console.log(yebid);
                                if (yebid) {
                                    usedYes.push(yebid._id);
                                    var yebidval = 0;
                                    bidValue -= yebid['bid_amount'];
                                    yebidval += yebid['bid_amount'];
                                    yebidval -= abid['bid_amount'];
                                    if (yebidval < 0) {
                                        yebidval = yebidval * -1;
                                    }
                                    bidValue += yebidval;
                                }
                                else {
                                    bidValue += abid['bid_amount'];
                                }
                            }
                            // if(amyData['name']=="aap"){
                            //     console.log(bidValue);
                            // }
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
                socketService_1.socketService.io.to(data.socket_id).emit('partyStatewise_', myData);
            }
            else {
                socketService_1.socketService.io.to(data.socket_id).emit('partyStatewise_', "state not exist");
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
                        let min_bids = yield Bid_1.default.findOne({ user_id: data.user_id, ticket_type: "tickets", ticket_id: aticket['_id'] }).sort({ seat: 1 });
                        let max_bids = yield Bid_1.default.findOne({ user_id: data.user_id, ticket_type: "tickets", ticket_id: aticket['_id'] }).sort({ seat: -1 });
                        let seatArray = [];
                        if (min_bids && max_bids) {
                            let min_num = min_bids['seat'] - 20 > 0 ? min_bids['seat'] - 20 : 1;
                            let max_num = min_bids['seat'] + 20;
                            for (let i = min_num; i <= max_num; i++) {
                                let exposure = 0;
                                for (const abid of abids) {
                                    if (abid['yes_or_no'] == "yes") {
                                        if (i >= abid['seat']) {
                                            let add_value = abid['bid_amount'] * abid['winning_percentage'] / 100;
                                            exposure += add_value;
                                        }
                                        else {
                                            exposure -= abid['bid_amount'];
                                        }
                                    }
                                    else {
                                        if (i < abid['seat']) {
                                            exposure += abid['bid_amount'] * 100 / abid['winning_percentage'];
                                        }
                                        else {
                                            let add_value = abid['bid_amount'];
                                            exposure -= add_value;
                                        }
                                    }
                                }
                                if (bidValue > exposure) {
                                    bidValue = exposure;
                                }
                                seatArray.push({ seat: i, exposure: exposure });
                            }
                        }
                        amyData['chart'] = seatArray;
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
                                mainValue += abid['bid_amount'] * abid['winning_percentage'] / 100;
                            }
                            else {
                                mainValue -= abid['bid_amount'] * abid['winning_percentage'] / 100;
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
        // // state wise tickets for adminn
        // socket.on('partyStatewiseAdminn', async (data)=>{ // state_id, user_id
        //     let state = await State.findOne({_id:data.state_id, status:true}, {__v: 0});
        //     if(state){
        //         let myData:object = state.toObject();
        //         myData['tickets']=[];
        //         const parties = await Party.find({state_id:state['_id'], status:true}, {__v: 0});
        //         let party_id_array =[];
        //         for (const party of parties) {
        //             party_id_array.push(party['_id']);
        //             // get ticket total yes or no winning amount
        //             let allTicket=await Ticket.find({party_id:party['_id'], status:true}, {__v: 0}).populate('party_id').sort({created_at: -1})
        //             for (const aticket of allTicket) {
        //                 let amyData = aticket.toObject();
        //                 let bidValue=0;
        //                 let user_id_array=[];
        //                 let popup_array=[];
        //                 let ubids = await Bid.find({ticket_type:"tickets", ticket_id:aticket['_id']}).sort({created_at: -1});
        //                 for (let ubid of ubids) {
        //                 let uin=user_id_array.includes(ubid['user_id']);
        //                 console.log(uin);
        //                 if(uin==false){
        //                     user_id_array.push(ubid['user_id']);
        //                 }
        //                     // user_id_array=user_id_array.filter((item, index) => user_id_array.indexOf(item) === index);
        //                 //     console.log(user_id_array.length);
        //                 //     if(user_id_array.length==0){
        //                 //         console.log("insert - 0");
        //                 //         user_id_array.push(ubid['user_id']);   
        //                 //     }else{
        //                 //         var exist=false;
        //                 //         for (let ui of user_id_array) {
        //                 //             console.log("ui"+ui);
        //                 //             console.log("ubid"+ubid['user_id']);
        //                 //             if(ui==ubid['user_id']){
        //                 //                 exist=true;
        //                 //             }
        //                 //         }
        //                 //         console.log(exist);
        //                 //         if(exist==true){
        //                 //             console.log("insert - false");
        //                 //             user_id_array.push(ubid['user_id']);
        //                 //         }
        //                 //     }
        //                 }
        //                 // user_id_array = user_id_array.filter( function( item, index, inputArray ) {
        //                 //     return inputArray.indexOf(item) == index;
        //                 // });
        //                 console.log(user_id_array);
        //                 for (const user_id of user_id_array) {
        //                     let abids = await Bid.find({user_id:user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({created_at: -1});
        //                     for (const abid of abids) {
        //                         let popup_obj:any={};
        //                         if(abid['yes_or_no']=="yes"){
        //                             // popup
        //                             let objIndex = popup_array.findIndex((obj => obj.id == abid['seat']));
        //                             if(objIndex==-1){
        //                                 popup_obj.yes_or_no="yes";
        //                                 popup_obj.id=abid['seat'];
        //                                 popup_obj.winning_percentage=abid['winning_percentage'];
        //                                 popup_obj.bid_amount=abid['bid_amount'];
        //                                 popup_array.push(popup_obj);
        //                             }else{
        //                                 popup_array[objIndex].bid_amount+=abid['bid_amount'];
        //                             }
        //                             // end popup
        //                             bidValue+=abid['bid_amount']*abid['winning_percentage']/100;
        //                         }else {
        //                             // popup
        //                             let objIndex = popup_array.findIndex((obj => obj.id == abid['seat']));
        //                             if(objIndex==-1){
        //                                 popup_obj.yes_or_no="no";
        //                                 popup_obj.id=abid['seat'];
        //                                 popup_obj.winning_percentage=abid['winning_percentage'];
        //                                 popup_obj.bid_amount=abid['bid_amount'];
        //                                 popup_array.push(popup_obj);
        //                             }else{
        //                                 popup_array[objIndex].bid_amount+=abid['bid_amount'];
        //                             }
        //                             // end popup
        //                             let no_seat=abid['seat']+1;
        //                             let yebids = await Bid.find({yes_or_no:"yes",seat: { $lte: no_seat}, user_id:user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({created_at: -1});
        //                             if(yebids&&yebids.length>0){
        //                                 bidValue-=abid['bid_amount']*abid['winning_percentage']/100;
        //                             }else{
        //                                 bidValue+=abid['bid_amount']*abid['winning_percentage']/100;
        //                             }
        //                         }
        //                         //console.log(popup_obj);
        //                     }
        //                 }
        //                 amyData['bidValue']=bidValue;
        //                 amyData['popup_array']=popup_array;
        //                 myData['tickets'].push(amyData);
        //             }
        //             //end
        //         }
        //         socketService.io.emit('partyStatewiseAdminn', myData);
        //     }else{
        //         socketService.io.emit('partyStatewiseAdminn', "state not exist");
        //     }
        // });
        // state wise tickets for adminn
        socket.on('partyStatewiseAdmin', (data) => __awaiter(this, void 0, void 0, function* () {
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
                        let abids = yield Bid_1.default.find({ ticket_type: "tickets", ticket_id: aticket['_id'] }, { yes_or_no: 1, seat: 1, bid_amount: 1, winning_percentage: 1 }).sort({ created_at: -1 });
                        let min_bids = yield Bid_1.default.findOne({ ticket_type: "tickets", ticket_id: aticket['_id'] }).sort({ seat: 1 });
                        let max_bids = yield Bid_1.default.findOne({ ticket_type: "tickets", ticket_id: aticket['_id'] }).sort({ seat: -1 });
                        let seatArray = [];
                        if (min_bids && max_bids) {
                            let min_num = min_bids['seat'] - 20 > 0 ? min_bids['seat'] - 20 : 1;
                            let max_num = min_bids['seat'] + 20;
                            for (let i = min_num; i <= max_num; i++) {
                                let exposure = 0;
                                for (const abid of abids) {
                                    if (abid['yes_or_no'] == "yes") {
                                        if (i >= abid['seat']) {
                                            exposure += abid['bid_amount'] * abid['winning_percentage'] / 100;
                                        }
                                        else {
                                            exposure -= abid['bid_amount'];
                                        }
                                    }
                                    else {
                                        if (i < abid['seat']) {
                                            exposure += abid['bid_amount'];
                                        }
                                        else {
                                            exposure -= abid['bid_amount'] * abid['winning_percentage'] / 100;
                                        }
                                    }
                                }
                                if (bidValue > exposure) {
                                    bidValue = exposure;
                                }
                                seatArray.push({ seat: i, exposure: exposure });
                            }
                        }
                        amyData['chart'] = seatArray;
                        amyData['bidValue'] = bidValue;
                        myData['tickets'].push(amyData);
                    }
                    //end
                }
                socketService_1.socketService.io.to(data.socket_id).emit('partyStatewiseAdmin', myData);
            }
            else {
                socketService_1.socketService.io.to(data.socket_id).emit('partyStatewiseAdmin', "state not exist");
            }
        }));
        // admin candidate bids locationwise
        // admin candidate bids locationwise
        socket.on('candidateLocationwiseAdmin', (data) => __awaiter(this, void 0, void 0, function* () {
            var location = yield Location_1.default.findOne({ _id: data.location_id, status: true }, { __v: 0 });
            if (location) {
                let myData = location.toObject();
                myData['tickets'] = [];
                myData['users'] = [];
                const candidates = yield Candidate_1.default.find({ location_id: myData['_id'], status: true }, { __v: 0 });
                // user ids 
                let candidate_id_array = [];
                for (const candidate of candidates) {
                    candidate_id_array.push(candidate['_id']);
                    // tickets
                    let mticket = yield TicketCandidate_1.default.findOne({ candidate_id: candidate['_id'], status: true }, { __v: 0 }).sort({ created_at: -1 }).populate('candidate_id');
                    if (mticket) {
                        let mTicketData = mticket.toObject();
                        myData['tickets'].push(mTicketData);
                    }
                }
                let tickets = yield TicketCandidate_1.default.find({ candidate_id: { "$in": candidate_id_array } });
                let ticket_id_array = [];
                for (const ticket of tickets) {
                    ticket_id_array.push(ticket['_id']);
                }
                let user_id_array = [];
                let ubids = yield Bid_1.default.aggregate([
                    { $match: { ticket_type: "ticket_candidates", ticket_id: { "$in": ticket_id_array } } },
                    { $group: { _id: { user_id: "$user_id" } } }
                ]);
                for (let ubid of ubids) {
                    user_id_array.push(ubid['_id']['user_id']);
                }
                // user chart or users array
                for (const user_id of user_id_array) {
                    var user = yield User_1.default.findOne({ _id: user_id }, { __v: 0 });
                    let myUserData = user.toObject();
                    myUserData['tickets'] = [];
                    for (const candidate of candidates) {
                        // get ticket total yes or no winning amount
                        let mainValue = 0;
                        let allTicket = yield TicketCandidate_1.default.find({ candidate_id: candidate['_id'], status: true }, { __v: 0 }).sort({ created_at: -1 });
                        for (const aticket of allTicket) {
                            let abids = yield Bid_1.default.find({ user_id: user_id, ticket_type: "ticket_candidates", ticket_id: aticket['_id'] }).sort({ created_at: -1 });
                            for (let abid of abids) {
                                if (abid['yes_or_no'] == "yes") {
                                    mainValue += abid['bid_amount'] * abid['winning_percentage'] / 100;
                                }
                                else {
                                    mainValue -= abid['bid_amount'] * abid['winning_percentage'] / 100;
                                }
                            }
                        }
                        // subtract other candidate ticket of same location value
                        let allOtherTicket = yield TicketCandidate_1.default.find({ candidate_id: { $ne: candidate['_id'] }, location_id: data.location_id, status: true }, { __v: 0 }).sort({ created_at: -1 });
                        for (const oticket of allOtherTicket) {
                            let ybids = yield Bid_1.default.find({ user_id: user_id, ticket_type: "ticket_candidates", ticket_id: oticket['_id'] }).sort({ created_at: -1 }).populate('ticket_id');
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
                            myUserData['tickets'].push(amyData);
                        }
                    }
                    myData['users'].push(myUserData);
                }
                socketService_1.socketService.io.to(data.socket_id).emit('candidateLocationwiseAdmin', myData);
            }
            else {
                socketService_1.socketService.io.to(data.socket_id).emit('candidateLocationwiseAdmin', 'Location Not Exist');
            }
        }));
    }
}
exports.SocketHandler = SocketHandler;
