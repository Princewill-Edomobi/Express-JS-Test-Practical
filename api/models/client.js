const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {type: String},
	name: {type: String},
	phone: {type: String},
    providers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider"
      }
    ],
},{ timestamps: {} });

module.exports = mongoose.model('Client',clientSchema);