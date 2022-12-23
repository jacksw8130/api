import * as mongoose from 'mongoose';
import { model } from 'mongoose';
import { Utils } from '../utils/Utils';

const NoticeSchema = new mongoose.Schema({
    title                    : {type: String, required: true},
    message                  : {type: String, required: true},
    status                   : {type: Boolean, required: true, default: true},
    created_at               : {type: Date, required: true, default: Utils.indianTimeZone},
    updated_at               : {type: Date, required: true, default: Utils.indianTimeZone},
},{ id : false });

NoticeSchema.set('toObject', { virtuals: true });
NoticeSchema.set('toJSON', { virtuals: true });

export default model('notices', NoticeSchema);

