const mongoose = require ('mongoose')

const {Schema} = mongoose;

const headerSchema = new Schema({
    banner:{
        type:String
    },
}, { timestamps: true })

const Header = mongoose.model('headers',headerSchema);
module.exports = Header