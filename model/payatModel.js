const mongoose = require('mongoose');
const schema = mongoose.Schema;


const payatSchema = new schema({
    payatAmount: { type: Number },
    depositedPayatee: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    receivedPayatee: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
},
    {
        timestamps: true,
    });

const payat = mongoose.model('payat', payatSchema);
module.exports = payat;