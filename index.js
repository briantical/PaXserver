var express = require("express");
var app = express();

var bodyParser = require("body-parser");

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

User = require("./models/user");
//Connect to mongoose
mongoose.connect(
	"mongodb://localhost:27017/paxDatastore",
	{ useNewUrlParser: true }
);

let db = mongoose.connection;

app.get("/", (req, res) => {
	res.send("WELCOME TO PAX SERVER");
});

app.get("/api/users", (req, res) => {
	User.getUsers((err, users) => {
		if (err) {
			console.log(err);
			throw err;
		}
		res.json(users);
	});
});

app.get("/api/users/:userEmail", (req, res) => {
	User.getUserByEmail(req.params.userEmail, (err, user) => {
		if (err) {
			console.log(err);
			throw err;
		}
		res.json(user);
	});
});

app.post("/api/users/newCheckin/:userEmail", (req, res) => {
	var realEmail = req.params.userEmail;
	var newCheckin = req.body;

	User.addCheckin(realEmail, newCheckin, {}, (err, newEntry) => {
		if (err) {
			console.log(err);
			throw err;
		}
		res.json(newCheckin);
	});
});

app.post("/api/users", (req, res) => {
	var user = req.body;
	User.addUser(user, (err, user) => {
		if (err) {
			console.log(err);
			throw err;
		}
		res.json(user);
	});
});

app.put("/api/users/:_id", (req, res) => {
	var id = req.params._id;
	var user = req.body;
	User.updateUser(id, user, {}, (err, user) => {
		if (err) {
			console.log(err);
			throw err;
		}
		res.json(user);
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));
