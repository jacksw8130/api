import * as JObScheduler from 'node-schedule';
import Ticket from '../models/Ticket';

export class WinningResult{

    public static rule = new JObScheduler.RecurrenceRule();

    static runResultJobs(){
        this.changeIsShow();
    }

    static changeIsShow() {
        this.rule.minute= new JObScheduler.Range(0, 59, 1); // every 1 min
        //this.rule.minute = 59;
        JObScheduler.scheduleJob('update is_Show', this.rule, async ()=>{   // this.rule or '11 * * * *'
            await Ticket.findOneAndUpdate({is_show: false, result_date:{ $lte : new Date }}, {is_show:true}, {new: true, useFindAndModify: false});
        });
    }


}
