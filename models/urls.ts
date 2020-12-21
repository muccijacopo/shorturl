import { Schema, model } from 'mongoose';
import shortId from 'shortid';

const urls = new Schema({
    full: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: false,
        default: shortId.generate
    },
    clicks: {
        type: Number,
        required: false,
        default: 0
    }
})



export default model<any>('urls', urls);