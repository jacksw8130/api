
import Bid from "../models/Bid";
import Candidate from "../models/Candidate";
import Party from "../models/Party";
import Location from "../models/Location";
import State from "../models/State";
import Ticket from "../models/Ticket";
import TicketCandidate from "../models/TicketCandidate";
import User from "../models/User";
import { socketService } from "./socketService";
import Admin from "../models/Admin";
import WalletTransaction from "../models/WalletTransaction";

export class SocketHandler{

    // io changed to socketService.io
    static connectSocket(){

        socketService.io.on('connection', function (socket){ // on connection
            // console.log('New Socket Connected: '+socket.id); 

            socket.on('disconnect', () => {                  // on disconnection
                // console.log('user disconnected: '+socket.id);
            });

            SocketHandler.uiHandler(socket);

        });

    }

    static uiHandler(socket){

        // Change Socket
        socket.on('change', async (type)=>{// type: socket_events
            if(type){
                socketService.io.emit('change', type);
            }else{
                socketService.io.emit('change', 'notfound');
            }
        });

        // All State
        socket.on('allState', async (socket_id)=>{//socket_id
            let state = await State.find({status:true}, {__v: 0});
            socketService.io.to(socket_id).emit('allState', state);
        });

        // Location Via State
        socket.on('locationViaStateId', async (data)=>{ // state_id, socket_id
            
            
            let location = await Location.find({state_id:data.state_id}, {__v: 0});
            if(location){
                socketService.io.to(data.socket_id).emit('locationViaStateId', location);
            }else{
                socketService.io.to(data.socket_id).emit('locationViaStateId', "No Location Present");
            }  
        });

        // User Data
        socket.on('userData', async (data:any)=>{ // user_id, socket_id
            socket.join(data.user_id);
            let user = await User.findOne({_id:data.user_id}, {__v: 0});
            if(user){
                let myData = user.toObject();
                // State ticket Sum 
                var ticketSum=0;
                let candidateTicketSum=0;
                let states = await State.find({status:true}, {__v: 0});
                for (const state of states) {

                    // state ticket
                    const parties = await Party.find({state_id:state['_id'], status:true, result_declare_status:false}, {__v: 0});
                    for (const party of parties) {
                        // get ticket total yes or no winning amount
                        let allTicket=await Ticket.find({party_id:party['_id'], status:true}, {__v: 0}).populate('party_id').sort({created_at: -1})
                        for (const aticket of allTicket) {
                            let bidValue=0;
                            let abids = await Bid.find({user_id:data.user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({created_at: -1});
                            let min_bids = await Bid.findOne({user_id:data.user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({seat: 1});
                            let max_bids = await Bid.findOne({user_id:data.user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({seat: -1});
                            if(min_bids && max_bids){
                                let min_num=min_bids['seat']-20>0 ? min_bids['seat']-20 : 1;
                                let max_num=min_bids['seat']+20;
                                
                                for(let i=min_num;i<=max_num;i++){
                                    let exposure=0;
                                    for (const abid of abids) {
                                        if(abid['yes_or_no']=="yes"){
                                            if(i>=abid['seat']){
                                                let add_value=abid['bid_amount']*abid['winning_percentage']/100;
                                                exposure+=add_value;
                                            }else{
                                                exposure-=abid['bid_amount'];
                                            }
                                        }else{
                                            if(i<abid['seat']){
                                                exposure+=abid['bid_amount']*100/abid['winning_percentage'];
                                            }else{
                                                let add_value=abid['bid_amount']
                                                exposure-=add_value;
                                            }
                                        }
                                    }
                                    if(bidValue>exposure){
                                        bidValue=exposure;
                                    }
                                }
                            }
                            if(bidValue<0)
                            {
                                bidValue=bidValue*-1;
                            }
                            ticketSum+=bidValue;
                        }
                        
                    }

                    // candidate tickets
                    let cStateExposure=0;
                    let locations = await Location.find({state_id:state['_id'], result_declare_status:false}, {__v: 0});
                    for (const location of locations) {
                        let myData:object = location.toObject();
                        let locationExposure=0;
                        const candidates = await Candidate.find({location_id:myData['_id'], status:true}, {__v: 0});
                        for (const candidate of candidates) {

                            // get ticket total yes or no winning amount
                            let mainValue=0;
                            let allTicket=await TicketCandidate.find({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1})
                            for (const aticket of allTicket) {
                                let abids = await Bid.find({user_id:data.user_id, ticket_type:"ticket_candidates", ticket_id:aticket['_id']}).sort({created_at: -1});
                                for (let abid of abids) {
                                    if(abid['yes_or_no']=="yes"){
                                        mainValue+=abid['bid_amount']*abid['winning_percentage']/100;
                                    }else {
                                        mainValue-=abid['bid_amount']*abid['winning_percentage']/100;
                                    }
                                }
                            }
                            // subtract other candidate ticket of same location value
                            let allOtherTicket=await TicketCandidate.find({candidate_id: { $ne: candidate['_id'] }, location_id:myData["_id"], status:true}, {__v: 0}).sort({created_at: -1})
                            for (const oticket of allOtherTicket) {
                                let ybids = await Bid.find({user_id:data.user_id, ticket_type:"ticket_candidates", ticket_id:oticket['_id']}).sort({created_at: -1}).populate('ticket_id');
                                for (let ybid of ybids) {
                                    if(ybid['yes_or_no']=="yes"){
                                        mainValue-=ybid['bid_amount'];
                                    }else{
                                        mainValue+=ybid['bid_amount'];
                                    }
                                }
                            }
                            if(mainValue<0)
                            {
                                mainValue=mainValue*-1;
                            }
                            if(mainValue>locationExposure){
                                locationExposure=mainValue;
                            }
                        }
                        cStateExposure+=locationExposure;
                    }
                    candidateTicketSum+=cStateExposure;
                }
                myData['ticketSum']=ticketSum;
                myData['candidateTicketSum']=candidateTicketSum;

                // total exposure
                myData['exposure']=ticketSum+candidateTicketSum;
                socketService.io.in(data.user_id).emit('userData', myData);
            }else{
                socketService.io.in(data.user_id).emit('userData', "No User Present");
            }
            
        });

         // admin data
        socket.on('adminData', async (data:any)=>{ // admin_id, socket_id
            socket.join(data.admin_id);
            let admin = await Admin.findOne({_id:data.admin_id}, {__v: 0});
            if(admin){
                let myData = admin.toObject();
                // total deposit
                const depositTransactions = await WalletTransaction.find({to_id:admin['_id'], mode:"transfer"});
                var dt=0;
                for (const depositTransaction of depositTransactions) {
                    dt+=depositTransaction['coins'];
                }
                myData['total_deposit']=dt;

                // total transfer
                const transferTransactions = await WalletTransaction.find({from_id:admin['_id'], mode:"transfer"});
                var tt=0;
                for (const transferTransaction of transferTransactions) {
                    tt+=transferTransaction['coins'];
                }
                myData['total_transfer']=tt;
                socketService.io.in(data.admin_id).emit('adminData', myData); 
            }else{
                socketService.io.in(data.admin_id).emit('adminData', "No admin Present"); 
            }
        });

        // state wise tickets for users
        socket.on('partyStatewise_', async (data)=>{ // state_id, user_id
            let state = await State.findOne({_id:data.state_id, status:true}, {__v: 0});
            if(state){
                let myData:object = state.toObject();
                myData['tickets']=[];
                const parties = await Party.find({state_id:state['_id'], status:true}, {__v: 0});
                let party_id_array =[];
                for (const party of parties) {
                    
                    party_id_array.push(party['_id']);

                    // get ticket total yes or no winning amount
                    let allTicket=await Ticket.find({party_id:party['_id'], status:true}, {__v: 0}).populate('party_id').sort({created_at: -1})
                            
                    for (const aticket of allTicket) {
                        let amyData = aticket.toObject();
                        let bidValue=0;
                        let usedYes=[];
                        let abids = await Bid.find({user_id:data.user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({created_at: -1});
                        for (const abid of abids) {
                            if(abid['yes_or_no']=="yes"){ 
                                bidValue+=abid['bid_amount'];
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

                        }else {
                            let no_seat=abid['seat'];
                            let yebid = await Bid.findOne({yes_or_no:"yes",seat: { $lte: no_seat}, user_id:data.user_id, ticket_type:"tickets", ticket_id:aticket['_id'], _id:{ "$nin": usedYes }}).sort({created_at: -1});
                            //console.log(yebid);
                            if(yebid){
                                usedYes.push(yebid._id);
                                var yebidval=0;
                                bidValue-=yebid['bid_amount'];
                                yebidval+=yebid['bid_amount'];
                                yebidval-=abid['bid_amount'];
                                if(yebidval<0)
                                {
                                    yebidval=yebidval*-1;
                                }
                                bidValue+=yebidval;
                            }else{
                                bidValue+=abid['bid_amount'];
                            }
                            
                        }

                        // if(amyData['name']=="aap"){
                        //     console.log(bidValue);
                        // }
                        }
                        
                        amyData['bidValue']=bidValue;
                        myData['tickets'].push(amyData);
                    }
                    //end
                    
                }
                let tickets = await Ticket.find({party_id:{ "$in": party_id_array }});
                let ticket_id_array =[];
                for (const ticket of tickets) {
                    ticket_id_array.push(ticket['_id']);
                }

                let bids = await Bid.find({user_id:data.user_id, ticket_type:"tickets", ticket_id:{ "$in": ticket_id_array }}).sort({created_at: -1}).populate([
                    { path:'ticket_id', populate:{ path: "party_id", populate: { path: "state_id" } }}
                ]);
                myData['bids']=bids;
                socketService.io.to(data.socket_id).emit('partyStatewise_', myData);
                
                
            }else{
                socketService.io.to(data.socket_id).emit('partyStatewise_', "state not exist");
            }
            
        });

         // state wise tickets for users
         socket.on('partyStatewise', async (data)=>{ // state_id, user_id
            let state = await State.findOne({_id:data.state_id, status:true}, {__v: 0});
            if(state){
                let myData:object = state.toObject();
                myData['tickets']=[];
                const parties = await Party.find({state_id:state['_id'], status:true}, {__v: 0});
                let party_id_array =[];
                for (const party of parties) {
                    
                    party_id_array.push(party['_id']);

                    // get ticket total yes or no winning amount
                    let allTicket=await Ticket.find({party_id:party['_id'], status:true}, {__v: 0}).populate('party_id').sort({created_at: -1})
                            
                    for (const aticket of allTicket) {
                        let amyData = aticket.toObject();
                        let bidValue=0;
                        let abids = await Bid.find({user_id:data.user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({created_at: -1});
                        let min_bids = await Bid.findOne({user_id:data.user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({seat: 1});
                        let max_bids = await Bid.findOne({user_id:data.user_id, ticket_type:"tickets", ticket_id:aticket['_id']}).sort({seat: -1});
                        let seatArray=[];
                        if(min_bids && max_bids){
                            let min_num=min_bids['seat']-20>0 ? min_bids['seat']-20 : 1;
                            let max_num=min_bids['seat']+20;
                            
                            for(let i=min_num;i<=max_num;i++){
                                let exposure=0;
                                for (const abid of abids) {
                                    if(abid['yes_or_no']=="yes"){
                                        if(i>=abid['seat']){
                                            let add_value=abid['bid_amount']*abid['winning_percentage']/100;
                                            exposure+=add_value;
                                        }else{
                                            exposure-=abid['bid_amount'];
                                        }
                                    }else{
                                        if(i<abid['seat']){
                                            exposure+=abid['bid_amount']*100/abid['winning_percentage'];
                                        }else{
                                            let add_value=abid['bid_amount']
                                            exposure-=add_value;
                                        }
                                    }
                                }
                                if(bidValue>exposure){
                                    bidValue=exposure;
                                }
                                seatArray.push({seat:i,exposure:exposure});
                            }
                        }
                        amyData['chart']=seatArray;  
                        amyData['bidValue']=bidValue;
                        myData['tickets'].push(amyData);
                    }
                    //end
                    
                }
                let tickets = await Ticket.find({party_id:{ "$in": party_id_array }});
                let ticket_id_array =[];
                for (const ticket of tickets) {
                    ticket_id_array.push(ticket['_id']);
                }

                let bids = await Bid.find({user_id:data.user_id, ticket_type:"tickets", ticket_id:{ "$in": ticket_id_array }}).sort({created_at: -1}).populate([
                    { path:'ticket_id', populate:{ path: "party_id", populate: { path: "state_id" } }}
                ]);
                myData['bids']=bids;
                socketService.io.to(data.socket_id).emit('partyStatewise', myData);
                
                
            }else{
                socketService.io.to(data.socket_id).emit('partyStatewise', "state not exist");
            }
            
        });


         // user candidate bids locationwise
         socket.on('candidateLocationwise', async (data)=>{ // location_id, user_id
            var location = await Location.findOne({_id:data.location_id, status:true}, {__v: 0});
            if(location){
                let myData:object = location.toObject();
                myData['tickets']=[];
                const candidates = await Candidate.find({location_id:myData['_id'], status:true}, {__v: 0});
                let candidate_id_array =[];
                for (const candidate of candidates) {
                    candidate_id_array.push(candidate['_id']);

                    // get ticket total yes or no winning amount
                    let mainValue=0;
                    let allTicket=await TicketCandidate.find({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1})
                    for (const aticket of allTicket) {
                        let abids = await Bid.find({user_id:data.user_id, ticket_type:"ticket_candidates", ticket_id:aticket['_id']}).sort({created_at: -1});
                        for (let abid of abids) {
                            if(abid['yes_or_no']=="yes"){
                                mainValue+=abid['bid_amount']*abid['winning_percentage']/100;
                            }else {
                                mainValue-=abid['bid_amount']*abid['winning_percentage']/100;
                            }
                        }
                    }
                    // subtract other candidate ticket of same location value
                    let allOtherTicket=await TicketCandidate.find({candidate_id: { $ne: candidate['_id'] }, location_id:data.location_id, status:true}, {__v: 0}).sort({created_at: -1})
                    for (const oticket of allOtherTicket) {
                        let ybids = await Bid.find({user_id:data.user_id, ticket_type:"ticket_candidates", ticket_id:oticket['_id']}).sort({created_at: -1}).populate('ticket_id');
                        for (let ybid of ybids) {
                            if(ybid['yes_or_no']=="yes"){
                                mainValue-=ybid['bid_amount'];
                            }else{
                                mainValue+=ybid['bid_amount'];
                            }
                        }
                    }

                    let tticket=await TicketCandidate.findOne({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1}).populate('candidate_id');
                    if(tticket){
                        let amyData = tticket.toObject();
                        amyData['mainValue']=mainValue;
                        myData['tickets'].push(amyData);
                    }
                }

                let tickets = await TicketCandidate.find({candidate_id:{ "$in": candidate_id_array }});
                let ticket_id_array =[];
                for (const ticket of tickets) {
                    ticket_id_array.push(ticket['_id']);
                }

                let bids = await Bid.find({user_id:data.user_id, ticket_type:"ticket_candidates", ticket_id:{ "$in": ticket_id_array }}).sort({created_at: -1}).populate([
                    { path:'ticket_id', populate:{ path: "candidate_id", populate: { path: "state_id" } }}
                ]);
                myData['bids']=bids;
                socketService.io.to(data.socket_id).emit('candidateLocationwise', myData);
            }else{
                socketService.io.to(data.socket_id).emit('candidateLocationwise', 'Location Not Exist');
            }
        });

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


                                            // ADMIN

        // state wise tickets for admin
        socket.on('partyStatewiseAdmin', async (data)=>{ // state_id, admin_id
            let state = await State.findOne({_id:data.state_id, status:true}, {__v: 0});

            const users = await User.find({admin_id:data.admin_id, status:true}, {__v: 0});
            let users_id_array =[];
            for (const user of users) {
                users_id_array.push(user['_id']);
            }

            if(state && users){
                let myData:object = state.toObject();
                myData['tickets']=[];
                const parties = await Party.find({state_id:state['_id'], status:true}, {__v: 0});
                let party_id_array =[];
                for (const party of parties) {
                    
                    party_id_array.push(party['_id']);

                    // get ticket total yes or no winning amount
                    let allTicket=await Ticket.find({party_id:party['_id'], status:true}, {__v: 0}).populate('party_id').sort({created_at: -1})
                            
                    for (const aticket of allTicket) {
                        let amyData = aticket.toObject();
                        let bidValue=0;
                        let abids = await Bid.find({ticket_type:"tickets", ticket_id:aticket['_id'], user_id:{ "$in": users_id_array }},{yes_or_no:1, seat:1, bid_amount:1, winning_percentage:1}).sort({created_at: -1});
                        
                        let min_bids = await Bid.findOne({ticket_type:"tickets", ticket_id:aticket['_id'], user_id:{ "$in": users_id_array }}).sort({seat: 1});
                        let max_bids = await Bid.findOne({ticket_type:"tickets", ticket_id:aticket['_id'], user_id:{ "$in": users_id_array }}).sort({seat: -1});
                        let seatArray=[];
                        if(min_bids && max_bids){
                            let min_num=min_bids['seat']-20>0 ? min_bids['seat']-20 : 1;
                            let max_num=min_bids['seat']+20;
                            
                            for(let i:number=min_num;i<=max_num;i++){
                                let exposure=0;
                                for (const abid of abids) {

                                    if(abid['yes_or_no']=="yes"){
                                        if(i>=abid['seat']){
                                            exposure+=abid['bid_amount']*abid['winning_percentage']/100;
                                        }else{
                                            exposure-=abid['bid_amount'];
                                        }
                                    }else{
                                        if(i<abid['seat']){
                                            exposure+=abid['bid_amount'];
                                        }else{
                                            exposure-=abid['bid_amount']*abid['winning_percentage']/100;
                                        }
                                    }
                                }
                                if(bidValue>exposure){
                                    bidValue=exposure;
                                }
                                seatArray.push({seat:i,exposure:exposure});
                            }
                        }
                        amyData['chart']=seatArray;  
                        amyData['bidValue']=bidValue;
                        myData['tickets'].push(amyData);
                    }
                    //end
                }
                socketService.io.to(data.socket_id).emit('partyStatewiseAdmin', myData);  
            }else{
                socketService.io.to(data.socket_id).emit('partyStatewiseAdmin', "state/admin not exist");
            }
        });
        
        // admin candidate bids locationwise
        socket.on('candidateLocationwiseAdmin', async (data)=>{ // location_id, admin_id
            var location = await Location.findOne({_id:data.location_id, status:true}, {__v: 0});
            const users = await User.find({admin_id:data.admin_id, status:true}, {__v: 0});
            let users_id_array =[];
            for (const user of users) {
                users_id_array.push(user['_id']);
            }
            if(location && users){
                let myData:object = location.toObject();
                myData['tickets']=[];
                myData['users']=[];
                const candidates = await Candidate.find({location_id:myData['_id'], status:true}, {__v: 0});
                
                // user ids 
                let candidate_id_array =[];
                for (const candidate of candidates) {
                    candidate_id_array.push(candidate['_id']);

                    // tickets
                    let mticket=await TicketCandidate.findOne({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1}).populate('candidate_id');
                    if(mticket){
                        let mTicketData = mticket.toObject();
                        myData['tickets'].push(mTicketData);
                    }

                }
                let tickets = await TicketCandidate.find({candidate_id:{ "$in": candidate_id_array }});
                let ticket_id_array =[];
                for (const ticket of tickets) {
                    ticket_id_array.push(ticket['_id']);
                }
                let user_id_array=[];
                let ubids = await Bid.aggregate([
                    { $match: {ticket_type:"ticket_candidates", ticket_id:{ "$in": ticket_id_array }, user_id:{ "$in": users_id_array }} },
                    { $group: { _id: { user_id: "$user_id" }} }
                ]);
                for (let ubid of ubids) {
                    user_id_array.push(ubid['_id']['user_id']);
                }

                // user chart or users array
                for (const user_id of user_id_array) {
                    var user = await User.findOne({_id:user_id}, {__v: 0});
                    let myUserData:object = user.toObject();
                    myUserData['tickets']=[];
                    for (const candidate of candidates) {
                        // get ticket total yes or no winning amount
                        let mainValue=0;
                        let allTicket=await TicketCandidate.find({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1})
                        for (const aticket of allTicket) {
                            let abids = await Bid.find({user_id:user_id, ticket_type:"ticket_candidates", ticket_id:aticket['_id']}).sort({created_at: -1});
                            for (let abid of abids) {
                                if(abid['yes_or_no']=="yes"){
                                    mainValue+=abid['bid_amount']*abid['winning_percentage']/100;
                                }else {
                                    mainValue-=abid['bid_amount']*abid['winning_percentage']/100;
                                }
                            }
                        }
                        // subtract other candidate ticket of same location value
                        let allOtherTicket=await TicketCandidate.find({candidate_id: { $ne: candidate['_id'] }, location_id:data.location_id, status:true}, {__v: 0}).sort({created_at: -1})
                        for (const oticket of allOtherTicket) {
                            let ybids = await Bid.find({user_id:user_id, ticket_type:"ticket_candidates", ticket_id:oticket['_id']}).sort({created_at: -1}).populate('ticket_id');
                            for (let ybid of ybids) {
                                if(ybid['yes_or_no']=="yes"){
                                    mainValue-=ybid['bid_amount'];
                                }else{
                                    mainValue+=ybid['bid_amount'];
                                }
                            }
                        }

                        let tticket=await TicketCandidate.findOne({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1}).populate('candidate_id');
                        if(tticket){
                            let amyData = tticket.toObject();
                            amyData['mainValue']=mainValue;
                            myUserData['tickets'].push(amyData);
                            
                        }
                    }
                    myData['users'].push(myUserData);
                }
                socketService.io.to(data.socket_id).emit('candidateLocationwiseAdmin', myData);
            }else{
                socketService.io.to(data.socket_id).emit('candidateLocationwiseAdmin', 'Location Not Exist');
            }
        });


                                            // SUPERADMIN
         // state wise tickets for superadmin
         socket.on('partyStatewiseSuperAdmin', async (data)=>{ // state_id, user_id
            let state = await State.findOne({_id:data.state_id, status:true}, {__v: 0});
            if(state){
                let myData:object = state.toObject();
                myData['tickets']=[];
                const parties = await Party.find({state_id:state['_id'], status:true}, {__v: 0});
                let party_id_array =[];
                for (const party of parties) {
                    
                    party_id_array.push(party['_id']);

                    // get ticket total yes or no winning amount
                    let allTicket=await Ticket.find({party_id:party['_id'], status:true}, {__v: 0}).populate('party_id').sort({created_at: -1})
                            
                    for (const aticket of allTicket) {
                        let amyData = aticket.toObject();
                        let bidValue=0;
                        let abids = await Bid.find({ticket_type:"tickets", ticket_id:aticket['_id']},{yes_or_no:1, seat:1, bid_amount:1, winning_percentage:1}).sort({created_at: -1});
                        
                        let min_bids = await Bid.findOne({ticket_type:"tickets", ticket_id:aticket['_id']}).sort({seat: 1});
                        let max_bids = await Bid.findOne({ticket_type:"tickets", ticket_id:aticket['_id']}).sort({seat: -1});
                        let seatArray=[];
                        if(min_bids && max_bids){
                            let min_num=min_bids['seat']-20>0 ? min_bids['seat']-20 : 1;
                            let max_num=min_bids['seat']+20;
                            
                            for(let i:number=min_num;i<=max_num;i++){
                                let exposure=0;
                                for (const abid of abids) {

                                    if(abid['yes_or_no']=="yes"){
                                        if(i>=abid['seat']){
                                            exposure+=abid['bid_amount']*abid['winning_percentage']/100;
                                        }else{
                                            exposure-=abid['bid_amount'];
                                        }
                                    }else{
                                        if(i<abid['seat']){
                                            exposure+=abid['bid_amount'];
                                        }else{
                                            exposure-=abid['bid_amount']*abid['winning_percentage']/100;
                                        }
                                    }
                                }
                                if(bidValue>exposure){
                                    bidValue=exposure;
                                }
                                seatArray.push({seat:i,exposure:exposure});
                            }
                        }
                        amyData['chart']=seatArray;  
                        amyData['bidValue']=bidValue;
                        myData['tickets'].push(amyData);
                    }
                    //end
                }
                socketService.io.to(data.socket_id).emit('partyStatewiseSuperAdmin', myData);  
            }else{
                socketService.io.to(data.socket_id).emit('partyStatewiseSuperAdmin', "state not exist");
            }
        });
        
        // superadmin candidate bids locationwise
        socket.on('candidateLocationwiseSuperAdmin', async (data)=>{ // location_id, user_id
            var location = await Location.findOne({_id:data.location_id, status:true}, {__v: 0});
            if(location){
                let myData:object = location.toObject();
                myData['tickets']=[];
                myData['users']=[];
                const candidates = await Candidate.find({location_id:myData['_id'], status:true}, {__v: 0});
                
                // user ids 
                let candidate_id_array =[];
                for (const candidate of candidates) {
                    candidate_id_array.push(candidate['_id']);

                    // tickets
                    let mticket=await TicketCandidate.findOne({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1}).populate('candidate_id');
                    if(mticket){
                        let mTicketData = mticket.toObject();
                        myData['tickets'].push(mTicketData);
                    }

                }
                let tickets = await TicketCandidate.find({candidate_id:{ "$in": candidate_id_array }});
                let ticket_id_array =[];
                for (const ticket of tickets) {
                    ticket_id_array.push(ticket['_id']);
                }
                let user_id_array=[];
                let ubids = await Bid.aggregate([
                    { $match: {ticket_type:"ticket_candidates",  ticket_id:{ "$in": ticket_id_array }} },
                    { $group: { _id: { user_id: "$user_id" }} }
                ]);
                for (let ubid of ubids) {
                    user_id_array.push(ubid['_id']['user_id']);
                }

                // user chart or users array
                for (const user_id of user_id_array) {
                    var user = await User.findOne({_id:user_id}, {__v: 0});
                    let myUserData:object = user.toObject();
                    myUserData['tickets']=[];
                    for (const candidate of candidates) {
                        // get ticket total yes or no winning amount
                        let mainValue=0;
                        let allTicket=await TicketCandidate.find({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1})
                        for (const aticket of allTicket) {
                            let abids = await Bid.find({user_id:user_id, ticket_type:"ticket_candidates", ticket_id:aticket['_id']}).sort({created_at: -1});
                            for (let abid of abids) {
                                if(abid['yes_or_no']=="yes"){
                                    mainValue+=abid['bid_amount']*abid['winning_percentage']/100;
                                }else {
                                    mainValue-=abid['bid_amount']*abid['winning_percentage']/100;
                                }
                            }
                        }
                        // subtract other candidate ticket of same location value
                        let allOtherTicket=await TicketCandidate.find({candidate_id: { $ne: candidate['_id'] }, location_id:data.location_id, status:true}, {__v: 0}).sort({created_at: -1})
                        for (const oticket of allOtherTicket) {
                            let ybids = await Bid.find({user_id:user_id, ticket_type:"ticket_candidates", ticket_id:oticket['_id']}).sort({created_at: -1}).populate('ticket_id');
                            for (let ybid of ybids) {
                                if(ybid['yes_or_no']=="yes"){
                                    mainValue-=ybid['bid_amount'];
                                }else{
                                    mainValue+=ybid['bid_amount'];
                                }
                            }
                        }

                        let tticket=await TicketCandidate.findOne({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1}).populate('candidate_id');
                        if(tticket){
                            let amyData = tticket.toObject();
                            amyData['mainValue']=mainValue;
                            myUserData['tickets'].push(amyData);
                            
                        }
                    }
                    myData['users'].push(myUserData);
                }
                socketService.io.to(data.socket_id).emit('candidateLocationwiseSuperAdmin', myData);
            }else{
                socketService.io.to(data.socket_id).emit('candidateLocationwiseSuperAdmin', 'Location Not Exist');
            }
        });

    }

}