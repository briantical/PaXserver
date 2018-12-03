var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

//create schema for the user
var userSchema = mongoose.Schema({
	userName: {
		type: String,
		required: true
	},
	userEmail: {
		type: String,
		required: true
	},
	userPassword: {
		type: String,
		required: true
	},
	userPhone: {
		type: String,
		required: true
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	userVehicle: {
		type: String,
		required: true
	},
	checkins: [
		{
			venue: {
				type: String,
				required: true
			},
			entryPoint: {
				type: String,
				required: true
			},
			exitPoint: {
				type: String,
				required: true,
				default: "still in"
			},
			vehicle: {
				type: String,
				required: true
			},
			owner: {
				type: Boolean,
				required: true
			},
			isOut: {
				type: Boolean,
				required: true
			},
			isPaid: {
				type: Boolean,
				required: true
			},
			amountPaid: {
				type: Number,
				required: true
			},
			entryDate: {
				type: Date,
				required: true,
				default: Date.now
			},
			exitDate: {
				type: Date,
				required: false,
				default: Date.now
			}
		}
	]
});

var User = (module.exports = mongoose.model("User", userSchema));

//get the users
module.exports.getUsers = function(callback, limit) {
	User.find(callback).limit(limit);
};

//get a user by ID
module.exports.getUserById = function(userID, callback) {
	User.findById(userID, callback);
};

//get a user by Email
module.exports.getUserByEmail = function(realEmail, callback) {
	User.findOne({ userEmail: realEmail }, { checkins: 1, _id: 0 }, callback);
};

//add a user
module.exports.addUser = function(user, callback) {
	User.create(user, callback);
};

//update a user
module.exports.updateUser = function(realEmail, user, options, callback) {
	var query = {
		$and: [{ userEmail: realEmail }, { "checkins.$.isOut": false }]
	};
	var update = {
		$set: {
			"checkins.$.exitDate": user.timeOut,
			"checkins.$.exitPoint": user.exitPoint,
			"checkins.$.isOut": user.isOut,
			"checkins.$.isPaid": user.isPaid,
			"checkins.$.amountPaid": user.amountPaid
		}
	};
	User.findOneAndUpdate(query, update, options, callback);
};

//add a new Checkin
module.exports.addCheckin = function(realEmail, newCheckin, options, callback) {
	var query = { userEmail: realEmail };
	console.log(newCheckin);
	var update = {
		$push: {
			checkins: { $each: [newCheckin], $position: 0 }
		}
	};
	User.findOneAndUpdate(query, update, options, callback);
};
