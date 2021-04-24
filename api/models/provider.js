const mongoose = require('mongoose');

const providerSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {type: String},
},{ timestamps: {} });

module.exports = mongoose.model('Provider',providerSchema);