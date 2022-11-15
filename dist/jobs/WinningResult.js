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
exports.WinningResult = void 0;
const JObScheduler = require("node-schedule");
const Ticket_1 = require("../models/Ticket");
class WinningResult {
    static runResultJobs() {
        this.changeIsShow();
    }
    static changeIsShow() {
        this.rule.minute = new JObScheduler.Range(0, 59, 1); // every 1 min
        //this.rule.minute = 59;
        JObScheduler.scheduleJob('update is_Show', this.rule, () => __awaiter(this, void 0, void 0, function* () {
            yield Ticket_1.default.findOneAndUpdate({ is_show: false, result_date: { $lte: new Date } }, { is_show: true }, { new: true, useFindAndModify: false });
        }));
    }
}
exports.WinningResult = WinningResult;
WinningResult.rule = new JObScheduler.RecurrenceRule();
