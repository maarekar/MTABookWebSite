const db = require("./database.js");
const StatusCodes = require('http-status-codes').StatusCodes;
const user = require('./user.js');
const g_messages = [];
const everyone = "everyone";
const messages_file = './files/messages.json';

function Message(message, id, date, from, to, sender_name) {
	this.message = message;
	this.id = id;
	this.date = date;
	this.from = from;
	this.to = to;
	this.sender_name = sender_name;
}

db.read_data(g_messages, messages_file).then(
	() => { console.log('Done reading users') }
).catch(reason => console.log('Failure:' + reason))

function send_message(req, res) {
	const text = req.body.text;
	const friend_id = req.body.friend_id;
	const user_status = req.body.user.status;

	if (!text) {
		res.status(StatusCodes.BAD_REQUEST);
		res.send("Missing text in request")
		return;
	}
	if (friend_id !== everyone) {
		if (friend_id <= 0) {
			res.status(StatusCodes.BAD_REQUEST);
			res.send("Bad id given")
			return;
		}

		const current_user = user.g_users.find(user => user.id == friend_id)
		if (!current_user) {
			res.status(StatusCodes.NOT_FOUND);
			res.send("No such friend")
			return;
		}
	}
	else {
		if (req.body.user.id != 1) {
			res.status(StatusCodes.UNAUTHORIZED);
			res.send("You are not admin");
			return;
		}
	}

	// Find max id 
	let max_id = 0;
	g_messages.forEach(
		item => { max_id = Math.max(max_id, item.id) }
	)

	const new_id = max_id + 1;

	const new_message = new Message(text, new_id, user.getFormattedDate(new Date()), req.body.user.id, friend_id, req.body.user.name);
	g_messages.push(new_message);
	db.write_file(g_messages, messages_file);

	res.send(JSON.stringify(new_message));
}

function get_messages(req, res) {
	const messages = g_messages.filter(message => (message.to === everyone || message.to == req.body.user.id)
		&& message.from != req.body.user.id);

	const current_user = user.g_users.find(user => user.id == req.body.user.id);
	current_user.last_message = messages.length;
	//user.g_users[req.body.user.id - 1] = current_user;
	db.write_file(user.g_users, user.users_file);
	res.send(JSON.stringify(messages));
}

function check_new_messages(req, res) {
	const messages = g_messages.filter(message => (message.to === everyone || message.to == req.body.user.id)
		&& message.from != req.body.user.id);


	const current_user = user.g_users.find(user => user.id == req.body.user.id);

	if (current_user.last_message != messages.length) {
		res.send(JSON.stringify({ "new_messages": true }));
	}
	else {
		res.send(JSON.stringify({ "new_messages": false }));
	}


}

module.exports = { messages_file, g_messages, send_message, get_messages, check_new_messages };