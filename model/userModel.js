const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    serialNum: {type: Number },
    mobile:{type: String },
    isAdmin: {type: Boolean, default:false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: String },

});

const user = mongoose.model('user', userSchema);
module.exports = user;