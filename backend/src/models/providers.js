import {Schema, model} from 'mongoose';

const providerSchema = new Schema({
    name: {
        type: String,
    },
    birthday: {
        type: Date,
    },
    height:{
        type: Number,
    },
    DUI: {
        type: String,
    },
    phone:{
        type: String,
    },
    
},{
    timestamps: true,
    strict: true  
})

export default model('provider', providerSchema);